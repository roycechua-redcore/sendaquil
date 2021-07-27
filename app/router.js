class Router extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			route: '',
			data: {},
			modalData: {},
		};
	}

	componentDidMount() {
		this.setState({ modalData: this.props.modalData });
	}

	componentDidUpdate(prevProps, prevState) {
		if(Object.entries(prevProps.modalData).length !== Object.entries(this.props.modalData).length) {
			this.setState({ modalData: this.props.modalData })
		}
	}

	handleChangeRoute = (newRouteName = '', newData = {}) => {
		if (!newData) {
			this.setState({ data: {} });
		}
		this.setState({ route: newRouteName, data: newData });
	};

	// wrapper function for freshdesk client.interface.trigger method
	handleShowInterface = (event = '', modalRouteName = '', data = {}) => {
		client.interface
			.trigger(event, modalRoutes(data)[modalRouteName])
			.then((data) => {})
			.catch((error) => {
				console.log(error);
			});
	};

	renderScreen() {
		const { route } = this.state;

		switch (route) {
			default:
				return (
					<TestScreen />
				);
		}
	}

	render() {
		return this.renderScreen();
	}
}

function renderRootNavigator(modalData = {}) {
	ReactDOM.render(<Router modalData={modalData} />, document.getElementById('router-container'));
}
app.initialized()
	.then(function (_client) {
		window.client = _client;
		client.events.on('app.activated', () => renderRootNavigator());
	})
	.catch(console.error);
