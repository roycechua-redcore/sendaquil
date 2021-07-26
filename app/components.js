class StringSlot extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return this.props.stringValue;
    }
}

class TableRow extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return <tr>
            <td className="w-50 py-2">{this.props.label}</td>
            <th className="w-50 py-2" scope="row">{this.props.value}</th>
        </tr>;
    }
}

class StaticTable extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let rows = this.props.rows.map((r, idx) => {
            return <TableRow key={idx} label={r.label} value={r.value}/>;
        });
        let table = <table className="table table-sm table-hover h5">
            <tbody>{rows}</tbody>
        </table>;
        return table;
    }
}

class StaticTableWithHeader extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let table = <StaticTable key="stwht" rows={this.props.rows}/>
        let header = <h2 key="stwhh">{this.props.header}</h2>
        return [header, table];
    }
}

class StaticTableList extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let listItems = this.props.items.map((i, idx) => {
            return <li key={idx}>
                <StaticTable rows={i}/>
            </li>
        });
        let header = <h2 key="stlh">{this.props.header}</h2>
        return [header, <ul key="stll" className="list-unstyled">{listItems}</ul>];
    }
}

class TableRowInput extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let msg = "\u00A0";
        if (this.props.hasOwnProperty("requiredChkPassed")) {
            if (!this.props.requiredChkPassed) {
                msg = "This field is required.";
            }
        }
        return <tr>
            <td className="w-50 pb-0 pt-2">{this.props.label}
                <p className="text-danger my-0 h6">{msg}</p>
            </td>
            <th className="w-50 pb-0 pt-2" scope="row">
                <input type="text" className="h5 font-weight-bold mt-0"
                       new-bene-idx={this.props.newBeneIdx}
                       onChange={this.props.onChange}
                       value={this.props.value}/>
            </th>
        </tr>;
    }
}

class TableRowEmail extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let msg = "\u00A0";
        if (!this.props.emailAddressValid) {
            msg = "Email Address is invalid."
        }
        return <tr>
            <td className="w-50 pb-0 pt-2">{this.props.label}
                <p className="text-danger my-0 h6">{msg}</p>
            </td>
            <th className="w-50 pb-0 pt-2" scope="row">
                <input type="text" className="h5 font-weight-bold mt-0"
                       new-bene-idx={this.props.newBeneIdx}
                       onChange={this.props.onChange}
                       onBlur={this.props.onBlur}
                       value={this.props.value}/>
            </th>
        </tr>;
    }
}

class TableRowShare extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let msg = "\u00A0";
        if (this.props.beneficiaryTotalShares !== 100) {
            msg = `Total shares is not 100%(${this.props.beneficiaryTotalShares}).`;
        } else if (this.props.value === 0 && this.props.beneficiaryTotalShares === 100) {
            msg = "Share cannot be zero.";
        } else if (this.props.hasOwnProperty("requiredChkPassed")) {
            if (!this.props.requiredChkPassed) {
                msg = "This field is required.";
            }
        }
        return <tr className="bg-info">
            <td className="w-50 pb-0 pt-2">{this.props.label}
                <p className="text-danger my-0 h6">{msg}</p>
            </td>
            <th className="w-50 pb-0 pt-2" scope="row">
                <input type="text" className="h5 font-weight-bold mt-0 text-right"
                       data-idx={this.props.idx}
                       value={this.props.value} onChange={this.props.onChange}/>
            </th>
        </tr>;
    }
}

class TableRowDate extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            msg: "\u00A0",
        };
    }

    handleChange(e) {
        if (moment(e.target.value).isBefore()) {
            this.setState({msg: "\u00A0"});
        } else {
            this.setState({msg: "Future dates not allowed."});
        }
        this.props.onChange(e);
    }

    render() {
        if (this.props.hasOwnProperty("requiredChkPassed")) {
            if (!this.props.requiredChkPassed) {
                this.state.msg = "This field is required.";
            }
        }
        return <tr>
            <td className="w-50 pb-0 pt-2">
                {this.props.label}
                <p className="text-danger my-0 h6">{this.state.msg}</p>
            </td>
            <th className="w-50 pb-0 pt-2" scope="row">
                <input className="font-weight-bold" new-bene-idx={this.props.newBeneIdx} type="date" name="dateOfBirth"
                       onChange={this.handleChange} value={this.props.value}/>
            </th>
        </tr>;
    }
}

class RelationshipSelect extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let msg = "\u00A0";
        if (this.props.hasOwnProperty("requiredChkPassed")) {
            if (!this.props.requiredChkPassed) {
                msg = "This field is required.";
            }
        }
        return <tr>
            <td className="pb-1 pt-2">Relationship to Insured *
                <p className="text-danger my-0 h6">{msg}</p>
            </td>
            <th className="pb-1 pt-2" scope="row">
                <select className="w-100 font-weight-bold"
                        new-bene-idx={this.props.newBeneIdx}
                        onChange={this.props.onChange}
                        value={this.props.value}>
                    <option> -</option>
                    <option value="Legal Spouse">Legal Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Life Partner">Life Partner</option>
                    <option value="Other">Other</option>
                </select>
            </th>
        </tr>;
    }
}

class RemoveNewBeneficiaryButton extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        if (!this.props.showButton) {
            return true;
        }
        return <tr>
            <td colSpan="2">
                <a className="btn btn-secondary active pull-right mr-2"
                   new-bene-idx={this.props.newBeneIdx}
                   onClick={this.props.onClick}> Remove </a>
            </td>
        </tr>;
    }
}

class BeneficiariesMultiForm extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const handler = this.props.stateHandler;
        const benes = this.props.stateHandler.state.newBeneficiaries;
        let showRemove = false;
        if (benes.length > 1) {
            showRemove = true;
        }
        const h = <h3 key="bfh">Add Beneficiary</h3>
        const beneTabs = [];
        benes.map((val, idx) => {
            const beneficiary = this.props.stateHandler.state.newBeneficiaries[idx];
            const key = `bff-${idx}`;
            const table = <table key={key} className="table table-sm table-hover h5">
                <tbody>
                <TableRowInput label="First Name *"
                               newBeneIdx={idx}
                               onChange={handler.onFirstNameChange}
                               requiredChkPassed={beneficiary.firstNameRequiredChkPassed}
                               value={beneficiary.firstName}/>
                <TableRowInput label="Middle Name"
                               newBeneIdx={idx}
                               onChange={handler.onMiddleNameChange}
                               value={beneficiary.middleName}/>
                <TableRowInput label="Last Name *"
                               newBeneIdx={idx}
                               requiredChkPassed={beneficiary.lastNameRequiredChkPassed}
                               onChange={handler.onLastNameChange}
                               value={beneficiary.lastName}/>
                <TableRowDate label="Date of Birth *"
                              newBeneIdx={idx}
                              requiredChkPassed={beneficiary.dateOfBirthRequiredChkPassed}
                              onChange={handler.onDateOfBirthChange}
                              value={beneficiary.dateOfBirth}/>
                <RelationshipSelect
                    newBeneIdx={idx}
                    requiredChkPassed={beneficiary.relationshipToInsuredRequiredChkPassed}
                    onChange={handler.onRelationshipSelectChange}
                    value={beneficiary.relationshipToInsured}/>
                <TableRowInput label="Mobile Number"
                               newBeneIdx={idx}
                               onChange={handler.onMobileNumberChange}
                               value={beneficiary.mobileNumber}/>
                <TableRowEmail label="Email Address"
                               newBeneIdx={idx}
                               onChange={handler.onEmailAddressChange}
                               onBlur={handler.onEmailAddressBlur}
                               emailAddressValid={beneficiary.emailValid}
                               value={beneficiary.email}/>
                <RemoveNewBeneficiaryButton newBeneIdx={idx}
                                            showButton={showRemove}
                                            onClick={handler.handleRemoveNewBeneficiary}/>
                </tbody>
            </table>;
            beneTabs.push(table);
        });
        return [h, beneTabs];
    }
}

class BeneficiaryEditShare extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let beneficiaries = this.props.beneficiaries.map((i, idx) => {
            if (i.isActive === false) {
                return;
            }
            return <li key={idx}>
                <table className="table table-sm table-hover h5">
                    <tbody>
                    <TableRow label="Customer ID" value={i.beneficiaryParty.manufacturerPersonCode}/>
                    <TableRow label="Full Name"
                              value={`${i.beneficiaryParty.firstName} ${i.beneficiaryParty.middleName} ${i.beneficiaryParty.lastName}`}/>
                    <TableRow label="Start Date" value={moment(i.startDate).format('MMM DD, YYYY')}/>
                    <TableRow label="End Date" value={i.endDate ? moment(i.endDate).format('MMM DD, YYYY') : '-'}/>
                    <TableRow label="Date of Birth"
                              value={moment(i.beneficiaryParty.birthdate).format('MMM DD, YYYY')}/>
                    <TableRow label="Relationship to Insured" value={i.relationship}/>
                    <TableRow label="Beneficiary Type" value={i.beneficiaryType}/>
                    <TableRow label="Beneficiary Share" value={i.basisPoints}/>
                    <TableRow label="Mobile Number" value={i.mobileNumber || '-'}/>
                    <TableRow label="Email Address" value={i.email || '-'}/>
                    </tbody>
                </table>
            </li>;
        });
        return <ul className="list-unstyled">{beneficiaries}</ul>
    }
}

class BeneficiariesAddMulti extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const header = <h2 key="bah">Beneficiaries</h2>;
        let addMoreButton = <a key="bam" className="btn btn-info active pull-right mr-4"
                               onClick={this.props.stateHandler.handleAddMoreBeneficiaries}> Add More </a>;
        let saveButton = <a key="bas" className="btn btn-primary active pull-right mr-4"
                            onClick={this.props.stateHandler.handleSaveNewBeneficiaries}> Save </a>;
        return [
            header,
            <BeneficiaryEditShare key="babes" beneficiaries={this.props.stateHandler.state.beneficiaries}/>,
            <BeneficiariesMultiForm key="babf" stateHandler={this.props.stateHandler}/>,
            saveButton,
            addMoreButton,
        ];
    }
}

class BeneficiariesList extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let tableList = <StaticTableList key="bll" header="Beneficiaries" items={this.props.items}/>;
        let addButton = <a key="bla" className="btn btn-primary active pull-right mr-4" onClick={this.props.switcher}>
            Add Beneficiary
        </a>;
        return [tableList, addButton];
    }
}

class Beneficiaries extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.handleShowBeneficiariesAdd = this.handleShowBeneficiariesAdd.bind(this);
        this.handleSaveNewBeneficiaries = this.handleSaveNewBeneficiaries.bind(this);
        this.handleAddMoreBeneficiaries = this.handleAddMoreBeneficiaries.bind(this);
        this.handleRemoveNewBeneficiary = this.handleRemoveNewBeneficiary.bind(this);
        this.onFirstNameChange = this.onFirstNameChange.bind(this);
        this.onLastNameChange = this.onLastNameChange.bind(this);
        this.onMiddleNameChange = this.onMiddleNameChange.bind(this);
        this.onDateOfBirthChange = this.onDateOfBirthChange.bind(this);
        this.onMobileNumberChange = this.onMobileNumberChange.bind(this);
        this.onEmailAddressChange = this.onEmailAddressChange.bind(this);
        this.onEmailAddressBlur = this.onEmailAddressBlur.bind(this);
        this.onRelationshipSelectChange = this.onRelationshipSelectChange.bind(this);
        this.state = {
            show: "list",
            beneficiaries: this.props.beneficiaries || [],
            beneficiaryTotalShares: 100,
            newBeneficiary: {
                firstName: "",
                firstNameRequiredChkPassed: true,
                middleName: "",
                lastName: "",
                lastNameRequiredChkPassed: true,
                dateOfBirth: "",
                dateOfBirthRequiredChkPassed: true,
                relationshipToInsured: "-",
                relationshipToInsuredRequiredChkPassed: true,
                mobileNumber: "",
                email: "",
                emailValid: true,
            },
            newBeneficiaries: [{
                firstName: "",
                firstNameRequiredChkPassed: true,
                middleName: "",
                lastName: "",
                lastNameRequiredChkPassed: true,
                dateOfBirth: "",
                dateOfBirthRequiredChkPassed: true,
                relationshipToInsured: "-",
                relationshipToInsuredRequiredChkPassed: true,
                mobileNumber: "",
                email: "",
                emailValid: true,
            },],
        }
    }

    handleShowBeneficiariesAdd() {
        this.setState({
            show: "add",
        });
    }

    validate() {
        let passed = true;
        let nb = this.state.newBeneficiaries;
        for (let i = 0; i < nb.length; i++) {
            let b = nb[i];
            b.firstName = b.firstName.trim();
            b.lastName = b.lastName.trim();
            b.middleName = b.middleName.trim();
            if (b.firstName === "") {
                b.firstNameRequiredChkPassed = false;
                passed = false;
            }
            if (b.lastName === "") {
                b.lastNameRequiredChkPassed = false;
                passed = false;
            }
            if (b.dateOfBirth === "") {
                b.dateOfBirthRequiredChkPassed = false;
                passed = false;
            }
            if (b.relationshipToInsured === "-") {
                b.relationshipToInsuredRequiredChkPassed = false;
                passed = false;
            }
        }
        this.setState({
            newBeneficiaries: nb,
        });
        return passed;
    }

    handleAddMoreBeneficiaries() {
        const newBeneficiary = {
            firstName: "",
            firstNameRequiredChkPassed: true,
            middleName: "",
            lastName: "",
            lastNameRequiredChkPassed: true,
            dateOfBirth: "",
            dateOfBirthRequiredChkPassed: true,
            relationshipToInsured: "-",
            relationshipToInsuredRequiredChkPassed: true,
            mobileNumber: "",
            email: "",
            emailValid: true,
        };
        const benes = this.state.newBeneficiaries;
        benes.push(newBeneficiary);
        this.setState({newBeneficiaries: benes});
    }

    handleSaveNewBeneficiaries() {
        if (!this.validate()) {
            return;
        }
        const ui = this;
        const policyId = this.props.policy.Id;
        const accessToken = this.props.accessToken;
        const policy = this.props.policy;
        client.request.invoke("addBeneficiaries", {
            newBeneficiaries: this.state.newBeneficiaries,
            policy,
            accessToken,
            productCode: this.props.productCode,
            mobile: this.props.mobile,
            kycDate: moment().format('YYYY-MM-DD'),
        }).then(function (data) {
            setTimeout(function () {
                client.request.invoke("getPolicy", {policyId, accessToken})
                    .then(function (data) {
                        const body = JSON.parse(data.response.body);
                        ui.setState({
                            show: "list",
                            newBeneficiaries: [{
                                firstName: "",
                                firstNameRequiredChkPassed: true,
                                middleName: "",
                                lastName: "",
                                lastNameRequiredChkPassed: true,
                                dateOfBirth: "",
                                dateOfBirthRequiredChkPassed: true,
                                relationshipToInsured: "-",
                                relationshipToInsuredRequiredChkPassed: true,
                                mobileNumber: "",
                                email: "",
                                emailValid: true,
                            }],
                            beneficiaries: body.data.beneficiaries,
                        });
                    }, function (err) {
                        client.interface.trigger("showNotify", {
                            type: "danger",
                            message: "Adding new beneficiary failed."
                        });
                    });
            }, 5000);
        }, function (err) {
            client.interface.trigger("showNotify", {
                type: "danger",
                message: "Adding new beneficiary failed."
            });
        });
    }

    handleRemoveNewBeneficiary(event) {
        const idx = event.target.attributes.getNamedItem("new-bene-idx").value;
        const newBenes = this.state.newBeneficiaries;
        newBenes.splice(idx, 1);
        this.setState({newBeneficiaries: newBenes});
    }

    _getBene(e) {
        const newBenes = this.state.newBeneficiaries;
        const idx = e.target.attributes.getNamedItem("new-bene-idx").value;
        const bene = newBenes[idx];
        return {bene, idx};
    }

    _setBenes(gb) {
        const newBenes = this.state.newBeneficiaries;
        newBenes[gb.idx] = gb.bene;
        this.setState({newBeneficiaries: newBenes});
    }

    onFirstNameChange(e) {
        const gb = this._getBene(e);
        gb.bene.firstName = e.target.value.trimStart();
        gb.bene.firstNameRequiredChkPassed = true;
        this._setBenes(gb);
    }

    onLastNameChange(e) {
        const gb = this._getBene(e);
        gb.bene.lastName = e.target.value.trimStart();
        gb.bene.lastNameRequiredChkPassed = true;
        this._setBenes(gb);
    }

    onMiddleNameChange(e) {
        const re = /^[\w ]+$/;
        const v = e.target.value.trimStart();
        if (v === "" || re.test(v)) {
            const gb = this._getBene(e);
            gb.bene.middleName = v;
            this._setBenes(gb);
        }
    }

    onDateOfBirthChange(e) {
        const gb = this._getBene(e);
        gb.bene.dateOfBirth = e.target.value;
        gb.bene.dateOfBirthRequiredChkPassed = true;
        this._setBenes(gb);
    }

    onRelationshipSelectChange(e) {
        const v = e.target.value;
        const gb = this._getBene(e);
        gb.bene.relationshipToInsured = v;
        gb.bene.relationshipToInsuredRequiredChkPassed = true;
        this._setBenes(gb);
    }

    onMobileNumberChange(e) {
        const v = e.target.value.trim();
        let re = /^09[0-9]{0,9}$/;
        if (v.length < 3) {
            re = /^09?$/;
        }
        if (v === "" || re.test(v)) {
            const gb = this._getBene(e);
            gb.bene.mobileNumber = v;
            this._setBenes(gb);
        }
    }

    onEmailAddressChange(e) {
        const v = e.target.value.trimStart();
        const gb = this._getBene(e);
        gb.bene.email = v;
        this._setBenes(gb);
    }

    onEmailAddressBlur(e) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const v = e.target.value.trim();
        const gb = this._getBene(e);
        if (v === "" || re.test(v)) {
            gb.bene.email = v;
            gb.bene.emailValid = true;
            this._setBenes(gb);
        } else if (!re.test(v)) {
            gb.bene.emailValid = false;
            this._setBenes(gb);
        }
    }

    render() {
        if (this.state.show === "list") {
            let items = [];
            this.state.beneficiaries.map((i, idx) => {
                if (i.isActive === false) {
                    return true;
                }
                let endDate = i.endDate ? moment(i.endDate).format('MMM DD, YYYY') : '-';
                if (endDate === '-') {
                    endDate = moment(this.props.policy.PolicyExpiryDateTime).format('MMM DD, YYYY');

                }
                let email = "-";
                let mobile = "-";
                const _cPts = i.beneficiaryParty.contactPoints;
                if (_cPts.length > 0) {
                    if (_cPts[0].type === "Mobile") {
                        mobile = _cPts[0].value;
                        if (_cPts[1]) {
                            email = _cPts[1].value;
                        }
                    } else {
                        email = _cPts[0].value;
                        if (_cPts[1]) {
                            mobile = _cPts[1].value;
                        }
                    }
                }
                let rows = [
                    {
                        label: "Customer ID",
                        value: i.beneficiaryParty.manufacturerPersonCode,
                    },
                    {
                        label: "Full Name",
                        value: `${i.beneficiaryParty.firstName} ${i.beneficiaryParty.middleName} ${i.beneficiaryParty.lastName}`,
                    },
                    {
                        label: "Start Date",
                        value: moment(i.startDate).format('MMM DD, YYYY'),
                    },
                    {
                        label: "End Date",
                        value: endDate,
                    },
                    {
                        label: "Date of Birth",
                        value: moment(i.beneficiaryParty.birthdate).format('MMM DD, YYYY'),
                    },
                    {
                        label: "Relationship to Insured",
                        value: i.relationship,
                    },
                    {
                        label: "Beneficiary Type",
                        value: i.beneficiaryType,
                    },
                    {
                        label: "Beneficiary Share",
                        value: i.basisPoints,
                    },
                    {
                        label: "Mobile Number",
                        value: mobile,
                    },
                    {
                        label: "Email Address",
                        value: email,
                    },
                ];
                items.push(rows);
            });
            return <BeneficiariesList items={items} switcher={this.handleShowBeneficiariesAdd}/>;
        } else if (this.state.show === "add") {
            return <BeneficiariesAddMulti stateHandler={this}/>
        }
    }
}

