class TestScreen extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.state = {
            number: "09178887782",
            message: "",
            load: false,
            show_table: false,
            customer_info: [{
                "firstname": "Juan",
                "middlename": "Santos",
                "lastname": "Dela Cruz",
                "birth_date": "July 1, 1997",
                "gender": "Male",
                "nationality": "PHL",
                "mobile": "09178887782",
                "email_address": "phtest@singlife.com.ph",
              }],
              customer_review: [{
                "kyc_result": "January 23, 2021",
                "last_updated_by": "anamarie.156",
                "last_update": "January 24, 2021",
                "tag": "Failed",
                "reason": "Lack of Requirements",
              }],
              policies: [{
                "number": "RP-0100032842",
                "code": "GDFG4dff",
                "name": "Cash for Income Loss (Accident)",
                "distribution_channel": "GCash",
                "role": "Primary Insured",
                "status": "Active",
                "effective_date": "July 1, 2021",
                "due_date": "June 30, 2021",
                "termination_date": "FIXME",
              },
              {
                "number": "RP-0100028566",
                "code": "GDFG4dff",
                "name": "Cash for Income Loss",
                "distribution_channel": "GCash",
                "role": "Primary Insured",
                "status": "Active",
                "effective_date": "July 05, 2021",
                "due_date": "July 04, 2021",
                "termination_date": "FIXME",
              }]
        };
    }

    handleReset(event) {
        this.setState({
            number: "",
            message: "",
        });
        event.preventDefault();
    }

    handleChange(e) {
        this.setState({number: e.target.value});
    }

    handleSubmit(event) {
        if (this.state.number === "") {
            this.setState({message: "Please provide mobile number in the input field", show_table: false});
            setTimeout(() =>{this.setState({message: ""})}, 2000);
        } else {
            this.setState({load: true, message: "Retrieving data...."});
            setTimeout(() =>{this.setState({show_table: true, load: false, message: ""})}, 2000);
        }
        event.preventDefault();
    }

    render() {

        let samp = (
            <div className="loader">
                <div className="spinner-border text-primary"></div>
                <span className="loading-text">
                    {this.state.message}
                </span>                
            </div>
        )

        return (
            <div className="container-style">
                <p className="search">Search Customer</p>
                <div className="search-form">
                    <input 
                        type="text" 
                        className="search-input-field" 
                        placeholder="Enter mobile number" 
                        value={this.state.number} 
                        onChange={this.handleChange}
                    />
                    <button type="button" className="reset" onClick={this.handleReset}>Reset</button>
                    <button type="button" className="search-button" onClick={this.handleSubmit}>Search</button>
                </div>
                
                { this.state.load ? samp : 
                    <p className="status">
                        {this.state.message}    
                    </p> 
                }
                {this.state.show_table ? 
                (
                    <div>
                        <div className="div-style">
                        <p className="account-number">SingLife Account Number: <span className="account-number-val">none</span></p>
                        <p className="cust-id">Customer id: <span className="cust-id-val">00000</span></p>
                        <p className="title">Customer Infomation</p>

                        <table class="table table-bordered" id="table-style">
                            <thead>
                                <tr>
                                    <th scope="col">First Name</th>
                                    <th scope="col">Middle Name</th>
                                    <th scope="col">Last Name</th>
                                    <th scope="col">Date of Birth</th>
                                    <th scope="col">Gender</th>
                                    <th scope="col">Nationality</th>
                                    <th scope="col">Mobile Number</th>
                                    <th scope="col">Email Address</th>
                                </tr>
                            </thead>
                            
                            {this.state.customer_info.map((info, i) => {
                                return(
                                    <tbody key={i}>
                                        <tr>
                                            <td>{info.firstname}</td>
                                            <td>{info.middlename}</td>
                                            <td>{info.lastname}</td>
                                            <td>{info.birth_date}</td>
                                            <td>{info.gender}</td>
                                            <td>{info.nationality}</td>
                                            <td>{info.mobile}</td>
                                            <td>{info.email_address}</td>
                                        </tr>
                                    </tbody>
                                )
                            })}
                        </table>
                    </div>

                    <div className="div-style">
                        <p className="title">Customer Review</p>
                        <table class="table table-bordered" id="table-style">
                            <thead>
                                <tr>
                                    <th scope="col">KYC Result</th>
                                    <th scope="col">Last Updated By</th>
                                    <th scope="col">Last Update</th>
                                    <th scope="col">Tag</th>
                                    <th scope="col">Reason</th>
                                </tr>
                            </thead>
                            {this.state.customer_review.map((review, i)=> {
                                return(
                                <tbody key={i}>
                                    <tr>
                                        <td>{review.kyc_result}</td>
                                        <td>{review.last_updated_by}</td>
                                        <td>{review.last_update}</td>
                                        <td>{review.tag}</td>
                                        <td>{review.reason}</td>
                                    </tr>
                            </tbody>
                                )
                            })}
                        </table>
                    </div>

                    <div className="div-style">
                        <p className="title">Policies</p>
                        <table class="table table-bordered" id="table-style">
                            <thead>
                                <tr>
                                    <th scope="col">Policy Number</th>
                                    <th scope="col">Product Code</th>
                                    <th scope="col">Product Name</th>
                                    <th scope="col">Distribution Channel</th>
                                    <th scope="col">Role</th>
                                    <th scope="col">Policy Status</th>
                                    <th scope="col">Policy Effective Date</th>
                                    <th scope="col">Next Premium Due Date</th>
                                    <th scope="col">Actual Termination Date</th>
                                </tr>
                            </thead>
                            {this.state.policies.map((policy, i) => {
                                return(
                                <tbody key={i}>
                                    <tr>
                                        <td className="policy-number">{policy.number}</td>
                                        <td colspa>{policy.code}</td>
                                        <td>{policy.name}</td>
                                        <td>{policy.distribution_channel}</td>
                                        <td>{policy.role}</td>
                                        <td colspa>{policy.status}</td>
                                        <td>{policy.effective_date}</td>
                                        <td>{policy.due_date}</td>
                                        <td>{policy.termination_date}</td>
                                    </tr>
                                </tbody>
                                )
                            })}
                            </table>
                    </div>
                    </div>
                ) : null}
            </div>
        )
    }
}
