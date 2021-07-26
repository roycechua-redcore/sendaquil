class StringSlot extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return this.props.stringValue;
    }
}

class PolicyInformation extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        const policyId = event.target.attributes
            .getNamedItem("data-policy-id").value;
        let policy = {};
        const p = this.props.policies;
        for (let i = 0; i < p.length; i++) {
            if (p[i].id === policyId) {
                policy = p[i];
                break;
            }
        }
        client.instance.send({
            message: {
                action: "showPolicy",
                policy,
                customer: this.props.customer,
            }
        });
        event.preventDefault();
    }

    render() {
        return this.props.policies.map((policy) => {
            let policyNumber = policy.policyNumber;
            if (policy.policyNumber.match(/policyId_/)) {
                policyNumber = policy.policyNumber.split('_')[1];
            }
            return <li key={policy.policyNumber}>
                <table className="table table-sm table-hover h5">
                    <tbody>
                    <tr>
                        <td className="py-2 label-column">Policy Number</td>
                        <th className="py-2" scope="row">
                            <a href="#" data-policy-id={policy.id} onClick={this.handleClick}>
                                {policyNumber}
                            </a>
                        </th>
                    </tr>
                    <tr>
                        <td className="py-2">Product Code</td>
                        <th className="py-2" scope="row">{policy.productCode}</th>
                    </tr>
                    <tr>
                        <td className="py-2">Product Name</td>
                        <th className="py-2" scope="row">{policy.productName}</th>
                    </tr>
                    <tr>
                        <td className="py-2">Distribution Channel</td>
                        <th className="py-2" scope="row">{policy.distributionChannel}</th>
                    </tr>
                    <tr>
                        <td className="py-2">Policy Owner</td>
                        <th className="py-2" scope="row">{policy.policyOwner}</th>
                    </tr>
                    <tr>
                        <td className="py-2">Role</td>
                        <th className="py-2" scope="row">{policy.role}</th>
                    </tr>
                    <tr>
                        <td className="py-2">Policy Status</td>
                        <th className="py-2" scope="row">{policy.status}</th>
                    </tr>
                    <tr>
                        <td className="py-2">Policy Effective Date</td>
                        <th className="py-2" scope="row">{policy.effectiveDate}</th>
                    </tr>
                    <tr>
                        <td className="py-2">Next Premium Date</td>
                        <th className="py-2" scope="row">{policy.nextPremiumDueDate}</th>
                    </tr>
                    </tbody>
                </table>
            </li>;
        });
    }
}

app.initialized()
    .then(function (_client) {
        window.client = _client;
        client.instance.context()
            .then(
                function (context) {
                    const c = context.data.customerInfo;
                    const slots = {
                        "customer-id": c.partyId,
                        "first-name": c.firstname,
                        "middle-name": c.middlename,
                        "last-name": c.lastname,
                        "date-of-birth": c.birthdate,
                        "gender": c.gender,
                        "nationality": c.nationality,
                        "mobile-number": c.mobile,
                        "email-address": c.email,
                    };
                    Object.keys(slots)
                        .map(function (key, idx) {
                            ReactDOM.render(
                                <StringSlot stringValue={slots[key]}/>,
                                document.getElementById(key)
                            );
                        });
                    ReactDOM.render(
                        <PolicyInformation policies={context.data.policies} customer={c}/>,
                        document.getElementById("policy-information")
                    );
                    //document.getElementById("raw-data").innerHTML =
                    //    JSON.stringify(context.data, null, 2);
                }
            );
    })
    .catch(console.error);
