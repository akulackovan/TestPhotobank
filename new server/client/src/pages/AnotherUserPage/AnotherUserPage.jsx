import {Component} from "react";
import {AnotherPage} from "../../components/AnotherPage/AnotherPage";


export default class AnotherUserPage extends Component {
    render() {
        return(
            <div className="anotherPage">
                <AnotherPage id={this.props.match.params.id}/>
            </div>
        )
    }
}
