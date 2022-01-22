import React from "react";
import Layout from "./components/layout.jsx"
class Index extends React.Component {
  render() {
    return <>
			<Layout>
            <h3>Rules:</h3>
            <div>
                You will be given some numbers and an end goal.
                You must use each number exactly once using the most common math functions to reach your goal.
                

            </div>
            </Layout>
    </>;
  }
}

export default Index;