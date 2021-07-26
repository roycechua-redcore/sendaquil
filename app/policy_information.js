function renderSlots(productName, status) {
    const slots = {
        "product-name": productName,
        "policy-status": status
    };
    Object.keys(slots)
        .map(function (key, idx) {
            ReactDOM.render(
                <StringSlot stringValue={slots[key]}/>,
                document.getElementById(key)
            );
        });
}

function renderPolicyOwnerInformation(owners) {
    let rows = [
        {
            label: "Customer ID",
            value: owners.partyId,
        },
        {
            label: "First Name",
            value: owners.firstname,
        },
        {
            label: "Middle Name",
            value: owners.middlename,
        },
        {
            label: "Last Name",
            value: owners.lastname,
        },
        {
            label: "Date of Birth",
            value: owners.birthdate,
        },
    ];
    ReactDOM.render(
        <StaticTableWithHeader header="Policy Owner Information" rows={rows}/>,
        document.getElementById("policy-owner-information")
    );
}

function renderPolicyInformation(policy, policyFromDyDb) {
    let nextPremiumDueDate = policy.NextPaymentDateTime ?
        moment(policy.NextPaymentDateTime).format('MMM DD, YYYY')
        : '-';
    if (policy.PremiumFrequency === 'Annually' && nextPremiumDueDate === '-') {
        nextPremiumDueDate = moment(policy.PolicyStartDateTime).add(1, 'y').format('MMM DD, YYYY');
    }
    let rows = [
        {
            label: "Policy Effective Date",
            value: moment(policy.PolicyStartDateTime).format('MMM DD, YYYY'),
        },
        {
            label: "Termination Date",
            value: moment(policy.PolicyExpiryDateTime).format('MMM DD, YYYY'),
        },
        {
            label: "Total Benefit Amount Per Insured",
            value: (policy.PolicyTotalSumInsured / policy.PolicyMembers.length).toLocaleString('en', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }),
        },
        {
            label: "Distribution Channel",
            value: 'GCash',
        },
        {
            label: "Coverage Level",
            value: policyFromDyDb.coverageLevel,
        },
        {
            label: "Premium Amount",
            value: policy.DenguePremiumAmount.toLocaleString('en', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }),
        },
        {
            label: "Next Premium Due Date",
            value: nextPremiumDueDate,
        },
        {
            label: "Premium Payment Frequency",
            value: policy.PremiumFrequency,
        },
        {
            label: "Cancellation Request Date",
            value: policy.CancellationDetails ? moment(policy.CancellationDetails).format('MMM DD, YYYY') : '-',
        },
    ];
    ReactDOM.render(
        <StaticTableWithHeader header="Policy Information" rows={rows}/>,
        document.getElementById("policy-information")
    );
}

function renderInsureds(policy) {
    let items = [];
    policy.PolicyMembers.map((i, idx) => {
        let endDate = policy.CancellationDetails ?
            moment(policy.CancellationDetails).format('MMM DD, YYYY')
            : '-';
        if (endDate === '-') {
            endDate = moment(policy.PolicyExpiryDateTime).format('MMM DD, YYYY');
        }
        let rows = [
            {
                label: "Customer ID",
                value: i.Id,
            },
            {
                label: "Role",
                value: i.Role,
            },
            {
                label: "Full Name",
                value: i.PolicyMemberName,
            },
            {
                //insured’s DOB - effective date, rounded down ~ K
                label: "Issue Age",
                value: moment(policy.PolicyStartDateTime).diff(moment(i.birthDate), 'years'),
            },
            {
                label: "Start Date",
                value: moment(policy.PolicyStartDateTime).format('MMM DD, YYYY'),
            },
            {
                label: "End Date",
                value: endDate,
            },
        ];
        items.push(rows);
    });
    ReactDOM.render(
        <StaticTableList header="Insureds" items={items}/>,
        document.getElementById("insureds")
    );
}

function renderBeneficiaries(data) {
    ReactDOM.render(
        <Beneficiaries
            policy={data.policy}
            beneficiaries={data.policy.beneficiaries}
            accessToken={data.accessToken}
            productCode={data.policyFromDyDb.productCode}
            mobile={data.customer.mobile}
        />,
        document.getElementById("beneficiaries")
    );
}

app.initialized()
    .then(function (_client) {
        window.client = _client;
        client.instance.context().then(
            function (context) {
                renderSlots(context.data.policyFromDyDb.productName, context.data.policy.Status);
                renderPolicyOwnerInformation(context.data.customer);
                renderPolicyInformation(context.data.policy, context.data.policyFromDyDb);
                renderInsureds(context.data.policy);
                renderBeneficiaries(context.data);
            }
        );
    })
    .catch(console.error);
