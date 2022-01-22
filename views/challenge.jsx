import React from "react";
import Layout from "./components/layout.jsx"
class Challenge extends React.Component {
  render() {
    return <>
        <Layout>
            <script src="/public/scripts/challenge.js"/>
            <div>challenge</div>
            <div id="display_challenge"/>
            <input id="submit_input" placeholer="submit"/>
            <button id="submit_button">submit</button>
        </Layout>
    </>;
  }
}

export default Challenge;