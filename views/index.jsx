import React from "react";
import Layout from "./components/layout.jsx"
class Index extends React.Component {
  render() {
    return <>
        <Layout>
            <h3>Construct Numbers</h3>
            <div className="side_margin">
                <p>The 24 Game is an arithmetical card game in which the objective is to find a way to manipulate four integers so that the end result is 24. For example, for the card with the numbers 4, 7, 8, 8, a possible solution is (7-(8/8))*4=24}</p>
                <p>I always found that a bit boring, so this website aims to spice it up with more options and a competative leaderboard</p>
                <p>You may use any math function know to wolfram alpha, and may be asked to constuct numbers other than 24. Here is an example of the creativity you can express without these restrictions.</p>
                <img src="/public/images/example.png"/>
            </div>
        </Layout>
    </>;
  }
}

export default Index;