"use client"
import Head from 'next/head'
import Link from 'next/link'
// import { BsArrowRight } from 'react-icons/bs'
import { useRouter } from "next/navigation"
import { useCallback, useContext, useEffect, useState } from "react"
import LogsContext from "../context/LogsContext"
import SemaphoreContext from "@/context/SemaphoreContext"
import Image from "next/image"
import { Identity } from "@semaphore-protocol/core"
import { VerificationLevel, IDKitWidget, useIDKit } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit"
import { verify } from "./actions/verify";
import { MdVerified } from "react-icons/md";
import {
    AnonAadhaarProof,
    LogInWithAnonAadhaar,
    useAnonAadhaar,
    useProver,
} from "@anon-aadhaar/react";

type HomeProps = {
    setUseTestAadhaar: (state: boolean) => void;
    useTestAadhaar: boolean;
};


export default function HomePage() {
    const router = useRouter()
    const { setLogs } = useContext(LogsContext)
    const { _reviews, _reviewers } = useContext(SemaphoreContext)
    const [_identity, setIdentity] = useState<Identity>()
    const [worldcoinScore, setWorldcoinScore] = useState(0);
    const [worldcoinVerified, setWorldcoinVerified] = useState(false);
    const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;
    const action = process.env.NEXT_PUBLIC_WLD_ACTION;
    const { setOpen } = useIDKit();

    const [anonAadhaar] = useAnonAadhaar();
    const [, latestProof] = useProver();

    useEffect(() => {
        if (anonAadhaar.status === "logged-in") {
            console.log(anonAadhaar.status);
        }
    }, [anonAadhaar]);

    useEffect(() => {
        const privateKey = localStorage.getItem("identity")

        if (privateKey) {
            const identity = new Identity(privateKey)

            setLogs("Your Semaphore identity has been retrieved from the browser cache 👌🏽")

            setIdentity(identity)
        }
    }, [setLogs])

    const createReview = useCallback(async () => {
        if (_identity && reviewerHasJoined(_identity)) {
            router.push("/review")
        } else {
            router.push("/prove")
        }
    }, [router, _reviewers, _identity])

    const reviewerHasJoined = useCallback((identity: Identity) => {
        return _reviewers.includes(identity.commitment.toString())
    }, [_reviewers])

    const onSuccess = (result: ISuccessResult) => {
        // This is where you should perform frontend actions once a user has been verified, such as redirecting to a new page
        window.alert(
            "Successfully verified with World ID! Your nullifier hash is: " +
            result.nullifier_hash
        );
    };

    const handleProof = async (result: ISuccessResult) => {
        console.log(
            "Proof received from IDKit, sending to backend:\n",
            JSON.stringify(result)
        ); // Log the proof from IDKit to the console for visibility
        const data = await verify(result);
        if (data.success) {
            setWorldcoinScore(1)
            setWorldcoinVerified(true);
            console.log("Successful response from backend:\n", JSON.stringify(data)); // Log the response from our backend for visibility
        } else {
            throw new Error(`Verification failed: ${data.detail}`);
        }
    };

    return (
        <div className='p-[10rem]'>
            <div className="hero-content text-black text-center">
                <div className="flex flex-col w-max">
                    <div className="mb-5 text-5xl font-serif font-bold"> Get Your Universal Profile ID
                    </div>
                    <div className="mb-5 text-xl">
                        Verify your onchain & offchain data for identity, credit score and healtcare data using TLSNotary & Worldcoin.
                    </div>
                    <div className='pt-10'>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-xl ">
                                <Link
                                    href="/">
                                    <div className="bg-white p-6 rounded-xl ">
                                        <h2 className="text-2xl font-semibold mb-4">Twitter Verification</h2>
                                        <p>Using TLSNotary</p>
                                    </div>
                                </Link>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-xl ">
                                <Link
                                    href="/">
                                    <div className="bg-white p-6 rounded-xl ">
                                        <h2 className="text-2xl font-semibold mb-4">Humanity Verification </h2>
                                        <IDKitWidget
                                            action={action!}
                                            app_id={app_id}
                                            onSuccess={onSuccess}
                                            handleVerify={handleProof}
                                            verification_level={VerificationLevel.Orb} // Change this to VerificationLevel.Device to accept Orb- and Device-verified users
                                        />
                                        <button
                                            className="bg-gray-800 text-white py-2 px-4 rounded-md text-sm hover:bg-gray-900 transition-colors"
                                            onClick={() => setOpen(true)}
                                        >
                                            {worldcoinVerified ? <div>Verified! <MdVerified className='text-green-400' />
                                            </div>
                                                : "Verify with World ID"}
                                        </button>
                                    </div>
                                </Link>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-xl ">
                                <Link
                                    href="/">
                                    <div className="bg-white p-6 rounded-xl">
                                        <h2 className="text-2xl font-semibold mb-4">Nationality Verification</h2>
                                        <p>Using AnonAdhaar</p>

                                        <div className='pt-4 align-center '>
                                            <LogInWithAnonAadhaar nullifierSeed={1234} />

                                        </div>

                                        {/* Render the proof if generated and valid */}
                                        {anonAadhaar.status === "logged-in" && (
                                            <>
                                                <p>✅ Proof is valid</p>
                                                <p>Got your Aadhaar Identity Proof</p>
                                                <>Welcome anon!</>
                                                {latestProof && (
                                                    <AnonAadhaarProof code={JSON.stringify(latestProof, null, 2)} />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </Link>
                            </div>
                        </div>

                    </div>
                    <div className='py-5'>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-xl ">
                                <Link
                                    href="/">
                                    <div className="bg-white p-6 rounded-xl ">
                                        <h2 className="text-2xl font-semibold mb-4">Credit Score Verification</h2>
                                        <p>Using TLSNotary</p>
                                    </div>
                                </Link>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-xl ">
                                <Link
                                    href="/">
                                    <div className="bg-white p-6 rounded-xl ">
                                        <h2 className="text-2xl font-semibold mb-4">Wallet Score</h2>
                                        <p></p>
                                    </div>
                                </Link>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-xl ">
                                <Link
                                    href="/">
                                    <div className="bg-white p-6 rounded-xl ">
                                        <h2 className="text-2xl font-semibold mb-4">Health Data</h2>
                                        <p>Coming Soon</p>
                                    </div>
                                </Link>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

            <div className="summary">
                All reviews are cryptographically guaranteed to be posted by reviewers who previously booked
                their hotels on{" "}
                <a
                    href="https://agoda.com"
                    target="_blank"
                    rel="noreferrer noopener nofollow"
                >
                    Agoda
                </a>{""}.
            </div>

            <div className="divider"></div>

            <div className="text-top">
                <h3><a
                    href="https://www.agoda.com/v-hotel-bencoolen/hotel/singapore-sg.html"
                    target="_blank"
                    rel="noreferrer noopener nofollow"
                >V Hotel Bencoolen, Singapore</a>
                </h3>
                {_reviews.length > 0 && (
                    <button className="button-link" onClick={createReview}>
                        Add Review
                    </button>
                )}
            </div>

            <div className="image-container">
                <Image
                    src="https://pix8.agoda.net/hotelImages/433173/-1/830fe0338a493daade4983f2e0011966.jpg?ca=7&ce=1&s=450x302"
                    alt="hotel picture"
                    width={405}
                    height={302}
                    priority={true}
                />
            </div>

            {_reviews.length > 0 ? (
                <div>
                    {_reviews.map((f, i) => (
                        <div key={i}>
                            <p className="box box-text">{f}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <button className="button" onClick={createReview}>
                        Create Review
                    </button>
                </div>
            )}

            <div className="divider"></div>

            <h3>Other hotels...</h3>

        </div>
    )
}
