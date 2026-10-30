// Generated from scripts/content.mjs and public/data. Do not edit directly.
import Link from '../components/AppLink';
import SiteShell from '../components/SiteShell';
import {sitePath} from '../lib/paths';
export const metadata={title:"Page Not Found"};
export default function Page(){return <SiteShell active="404/"><main id={"main"}><section className={"wrap error-page"}><p className={"eyebrow"}>{"OUTSIDE THE TOUCHLINE"}</p><span className={"error-number"}>{"404"}</span><h1>{"THIS BALL"}<br />{"WENT OUT OF PLAY."}</h1><p>{"The page you’re looking for isn’t here. Let’s get you back in the game."}</p><Link className={"button red"} href={"/"}>{"Back to home"}<span aria-hidden={"true"}>{"↗"}</span></Link><Link className={"button outline"} href={"/fixtures/"}>{"Explore matchday"}<span aria-hidden={"true"}>{"↗"}</span></Link></section></main></SiteShell>;}
