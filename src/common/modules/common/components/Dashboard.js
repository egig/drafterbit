import React from 'react';
import Layout from './Layout';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import translate from '../../../../translate';
import Card from '../../../components/Card/Card';

class Dashboard extends React.Component {

    renderProjects() {
        const { projects } = this.props;
        let t = this.props.t;

        if(!projects.length) {
            return (
                <div className="col-4">
                    {t('dashboard:no_project_text')} &nbsp;
                </div>
            );
        }

        return (
            <ul className="list-group">
                {projects.map((item,i) => {
                    return <li key={i} className="list-group-item"><Link to={`/project/${item._id}`}>{item.name}</Link></li>;
                })}
            </ul>
        );
    }

    render() {
	    let t = this.props.t;

	    return (
		    <Layout>
			    <div className="row justify-content-md-center mt-4">
				    <div className="col col-md-6">
					    <Card headerText="Projects">
						    {this.renderProjects()}
						    <Link className="btn btn-primary mt-3" to="/project/new">{t('dashboard:add_project_btn_text')}</Link>
					    </Card>
				    </div>
			    </div>
		    </Layout>
	    );
    }
}

const mapStateToProps = (state) => {
    return {
        projects: state.project.projects
    };
};

export default translate(['dashboard'])(connect(mapStateToProps)(Dashboard));