/**
 * RTFM:
 * - https://developers.freshdesk.com/v2/docs/interface-methods/#ticketshowmodal
 * - https://developers.freshdesk.com/v2/docs/server-method-invocation/
 * @param target
 */
function getPartyPoliciesByMobile(target, mobileNumber) {
    var options = {"mobile": mobileNumber};
    client.request.invoke("getPartyPoliciesByMobile", options)
        .then(function (data) {
            const response = JSON.parse(data.response.body);
            if (response.data.customerInfo == null) {
                target.setState({msg: "Customer record does not exist."});
            } else {
                target.setState({msg: "Found."});
                const customerInfo = response.data.customerInfo;
                const title = `${customerInfo.firstname} ${customerInfo.middlename} ${customerInfo.lastname}`;
                client.interface.trigger("showModal", {
                    title,
                    template: "customer_information.html",
                    data: {
                        customerInfo: response.data.customerInfo,
                        policies: response.data.policies,
                    },
                });
                //target.setState({msg: "\u00A0"});
            }
        }, function (err) {
            //FIXME: show error in Search box
            client.interface.trigger("showNotify", {type: "danger", message: JSON.stringify(err)});
        });
}

var search_style = {
    "fontSize": "large"
};

class Search extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            msg: "\u00A0",
            number: props.contactMobile,
        };
    }

    handleSubmit(event) {
        if (this.state.number.trim() === "") {
            this.setState({msg: "Blank mobile number."});
        } else {
            this.setState({msg: "\u00A0"});
            getPartyPoliciesByMobile(this, this.state.number);
        }
        event.preventDefault();
    }

    handleReset(event) {
        this.setState({
            msg: "\u00A0",
            number: ""
        });
        event.preventDefault();
    }

    handleChange(event) {
        this.setState({number: event.target.value});
    }

    render() {
        return <form onSubmit={this.handleSubmit}>
            <div>
                <div className="form-group">
                    <label htmlFor="search-number">Search Customers</label>
                    <input id="search-number" name="search-number"
                           type="text"
                           className="form-control text-monospace font-weight-bold text-muted"
                           style={search_style}
                           value={this.state.number}
                           onChange={this.handleChange}/>
                    <p id="msg" className="help-block">{this.state.msg}</p>
                </div>
                <div className="pull-left">
                    <button onClick={this.handleReset}
                            className="btn btn-default btn-sm pull-left border border-secondary">
                        Reset
                    </button>
                </div>
                <div className="pull-right">
                    <button type="submit" className="btn btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                             fill="currentColor" className="bi bi-search"
                             viewBox="0 0 16 16">
                            <path
                                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                        Search
                    </button>
                </div>
            </div>
        </form>;
    }
}

function refreshNumber() {
    client.data.get("contact")
        .then(function (data) {
            ReactDOM.render(
                <Search contactMobile={data.contact.mobile || ""}/>,
                document.getElementById("search")
            );
        });
}

function showPolicy(data) {
    const customerDetails = data.customerDetails;
    const options = {
        policyId: data.policyDetails.policyFromDyDb.id.split('_')[1],
        accessToken: data.accessToken,
    };
    const policyFromDyDb = data.policyDetails.policyFromDyDb;
    const accessToken = data.accessToken;
    client.request.invoke("getPolicy", options).then(
        function (data) {
            if (data.response.statusCode !== 200) {
                const msg = JSON.parse(data.response.body).response.error.message;
                const desc = JSON.parse(data.response.body).desc;
                client.interface.trigger("showNotify", {
                    type: "danger",
                    title: desc,
                    message: msg,
                    /* The "message" should be plain text */
                }).then(function (data) {
                    // data - success message
                }).catch(function (error) {
                    // error - error object
                });
                return;
            }
            const policy = JSON.parse(data.response.body).data;
            console.log(`xxx-policy: ${JSON.stringify(policy, null, 2)}`);
            client.interface.trigger("showModal", {
                title: policy.PolicyNumber === "" ? "(No Policy Number assigned)" : policy.PolicyNumber,
                template: "policy_information.html",
                data: {
                    policyFromDyDb,
                    policy,
                    customer: customerDetails,
                    accessToken
                },
            });
        },
        function (err) {
            //console.log(`xxx-auth-mew-err: ${JSON.stringify(err, null, 2)}`);
        });
}

// RTFM:
// - https://developers.freshdesk.com/v2/docs/app-lifecycle-methods/#onappactivated
// - https://developers.freshdesk.com/v2/docs/data-methods/#contactAPI
app.initialized()
    .then(function (_client) {
        window.client = _client;
        client.events.on("app.activated", refreshNumber);
        client.events.on("ticket.nextTicketClick", refreshNumber);
        client.events.on("ticket.previousTicketClick", refreshNumber);
        client.instance.receive(
            function (event) {
                var data = event.helper.getData();
                if (data.message.action === "showPolicy") {
                    const options = {
                        policyFromDyDb: data.message.policy,
                        mobile: data.message.customer.mobile,
                    };
                    const customerDetails = data.message.customer;
                    client.request.invoke("authMewProfile", options).then(
                        function (data) {
                            const accessToken = JSON.parse(data.response.body).result.accessToken;
                            showPolicy({
                                customerDetails,
                                policyDetails: options,
                                accessToken
                            });
                        },
                        function (err) {
                            //console.log(`xxx-auth-mew-err: ${JSON.stringify(err, null, 2)}`);
                        });
                }
            }
        );
    });

