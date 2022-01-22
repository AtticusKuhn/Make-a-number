import React from 'react';
import Pagelink from "./link.jsx"
const Layout = (props)=>(
    <>
        <script  src="/public/scripts/main.js" />
        <link rel="stylesheet" href="/public/styles/main.css" />

        <dix>
            <div id="alert_container">
                <div id="message" />
                <button id="close">close</button>
            </div>

            header
            <Pagelink name="Home" link="/" />
            <Pagelink name="Rules" />
            <Pagelink name="Login" />
            <Pagelink name="Leaderboard" />

            <Pagelink name="Get a challenge" link="challenge"/>
        </dix>
            {props.children}
        <p>footer. Made by <a href="https://repl.it/@AtticusKuhn">@AtticusKuhn</a></p>
    </>
)
export default Layout