"use strict";

function buildMangaList(data, callback) {

	var mangas = [];

	for(var manga of data) {
		mangas.push(manga._source.manga);
	}

	callback(mangas);
}

const StatAll = React.createClass({

	makeStats(mangas) {

		var data = {};

		data.total = Object.keys(mangas).length;

		data.types = [];

		for(var manga of mangas) {

			if(data.types.indexOf(manga.type) < 0) {

				data.types.push(manga.type);

				data.types[manga.type] = 1;

			} else {
				data.types[manga.type] = data.types[manga.type] + 1;
			}
		}

		for(var i in data.types) {

			if(!isNaN(parseInt(i))) {

				var type = data.types[i];

				data.types[i] = {
					type: type,
					number: data.types[data.types[i]]
				}

			} else {
				delete data.types[i];
			}
		}

		console.log(data);

		this.setState({data: data});
	},

	loadAllMangas() {

		$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
			success: function(data) {

				buildMangaList(data, (mangas) => {
					console.log(mangas);
					this.setState({mangas: mangas});

					this.makeStats(mangas);
				});

			}.bind(this),

			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},

	getInitialState() {
	    return {
	        data: {},
	        mangas: []
	    };
	},

	componentDidMount() {
		this.loadAllMangas();
	},

	displayName: "StatAll",

	render() {

		if(this.state.data.types) {

			return (

				<div>
					{this.state.data.total}
					<StatList types={this.state.data.types} />
				</div>
			)
		}

		return <div>Loading...</div>
	}
});

const StatList = React.createClass({
	displayName: 'StatList',
	render() {

		console.log(this.props.types);

		var typeNodes = this.props.types.map(function(type) {

			return (
				<Type type={type.type} number={type.number} key={type.type}>
				</Type>
			)
		});

		return (
			<div className="StatList">
				{typeNodes}
			</div>
		)
	}
});

const Type = React.createClass({

	displayName: 'Type',

	render() {

		return (
			<div className="type">
				<h2 className="typeName">
					{this.props.type} : {this.props.number}
				</h2>
			</div>
		)
	}
});


const MangaBox = React.createClass({

	loadMangas() {

		$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
			success: function(data) {

				buildMangaList(data, (mangas) => {
					console.log(mangas);
					this.setState({mangas: mangas});
				});

			}.bind(this),

			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},

	getInitialState() {
	    return {
	        data: [],
	        mangas: []
	    };
	},

	componentDidMount() {
		this.loadMangas();
	},

	displayName: 'MangaBox',
	render() {

		return (
			<div className="MangaBox">
				<MangaList mangas={this.state.mangas} />
			</div>
		);
	}
});

const MangaList = React.createClass({
	displayName: 'MangaList',
	render() {

		var mangaNodes = this.props.mangas.map(function(manga) {

			return (
				<Manga name={manga.name} key={manga.name}>
				</Manga>
			)
		});

		return (
			<div className="MangaList">
				{mangaNodes}
			</div>
		)
	}
});

const Manga = React.createClass({

	displayName: 'Manga',

	render() {

		return (
			<div className="manga">
				<h2 className="mangaName">
					{this.props.name}
				</h2>
			</div>
		)
	}
});

ReactDOM.render(
	<StatAll url='http://localhost:1208/mangas/all' pollInterval={2000} />,
	document.getElementById('content')
);
