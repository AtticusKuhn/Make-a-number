import React from 'react';
import Layout from "./components/layout.jsx"
class Leaderboard extends React.Component {
  render() {
    return <>
			<Layout>
                <script  src="/public/scripts/leaderboard.js" />
                <table className="side_margin" id="leaderboard_table">
                    <tr>
                        <th>Member Name</th>
                        <th>Number of Points</th>
                        <th>Rank</th>
                        <th>PFP</th>
                    </tr>
                    

            
                </table>
                <button style ={{"display":"none"}} id = "load_more">Load More</button>
            </Layout>
    </>;
  }
}

export default Leaderboard;