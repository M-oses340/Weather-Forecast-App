import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/";
import styles from "../styles/Login.module.css";
import { magic } from "../lib/magic-client";

import { useState, useEffect } from "react";


const Login = () => {
    const [email, setEmail] = useState("");
    const [userMsg, setUserMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleComplete = () => {
          setIsLoading(false);
        };
        router.events.on("routeChangeComplete", handleComplete);
        router.events.on("routeChangeError", handleComplete);
    
        return () => {
          router.events.off("routeChangeComplete", handleComplete);
          router.events.off("routeChangeError", handleComplete);
        };
    }, [router]);



    const handleOnChangeEmail = (e) => {
      setUserMsg("");
      console.log("event", e);
      const email = e.target.value;
      setEmail(email);
    };
  

    const handleLoginWithEmail = async (e) => {
        console.log("hi button");
        e.preventDefault();
        setIsLoading(true);

        if (email) {
            if (email === "mosesomwa98@gmail.com") {
                // route to dashboard
                router.push("/");
                //  log in a user by their email
                try {
                  const didToken = await magic.auth.loginWithMagicLink({ email, });
                  console.log({ didToken });
                    if (didToken) {
                        setIsLoading(false);
                        router.push("/");
                    }
                } catch (error) {
                  // Handle errors if required!
                  console.error("Something went wrong logging in", error);
                  setIsLoading(false);
                }
                // router.push("/");
            } else {
                console.log("Something went wrong logging in");
                setIsLoading(false);
                setUserMsg("Something went wrong logging in");
                

            }
        } else {
          // show user message
          setIsLoading(false);
          setUserMsg("Enter a valid email address");
        }

    };
    

  return (
    <div className={styles.container}>
        <Head>
            <title>Netflix SignIn</title>
        </Head>
        <header className={styles.header}>
            <div className={styles.headerWrapper}>
                <Link className={styles.logoLink} href="/">
                    <a>
                        <div className={styles.logoWrapper}>
                            <Image
                             src="/static/netflix.svg"
                             alt="Weather Forecast logo"
                             width="128px"
                             height="34px"
                            />
                        </div>
                    </a>
                </Link>
            </div>
        </header>

        <main className={styles.main}>
            <div className={styles.mainWrapper}>
              <h1 className={styles.signinHeader}>Sign In</h1>

                <input
                 type="text"
                 placeholder="Email address"
                 className={styles.emailInput}
                 onChange={handleOnChangeEmail}
                />

                <p className={styles.userMsg}>{userMsg}</p>
                <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
                  Sign In
                  {isLoading ? "Loading..." : "Sign In"}
                </button>
            </div>
        </main>
    </div>
  );
};
export default Login;