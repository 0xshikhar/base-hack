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

export default function HomePage() {
    const router = useRouter()
    const { setLogs } = useContext(LogsContext)
    const { _reviews, _reviewers } = useContext(SemaphoreContext)
    const [_identity, setIdentity] = useState<Identity>()

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

    return (
        <div className='p-[10rem]'>
            <div className="hero-content text-black text-center">
                <div className="flex flex-col w-max">
                    <div className="mb-5 text-5xl font-serif font-bold"> Get Your Universal Profile 
                    </div>
                    <div className="mb-5 text-xl">
                        Verify your onchain & offchain data for identity, credit score and healtcare data using TLSNotary & Worldcoin.
                    </div>
                    <div className='pt-10'>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-xl ">
                                <Link
                                    href="/loan?state=lend">
                                    <div className="bg-white p-6 rounded-xl ">
                                        <h2 className="text-2xl font-semibold mb-4">For Stakers</h2>
                                        <p>Just liquid stake your EDU tokens and get onchain yields and platform rewards.</p>
                                    </div>
                                </Link>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-xl ">
                                <Link
                                    href="/loan?state=borrow">
                                    <div className="bg-white p-6 rounded-xl ">
                                        <h2 className="text-2xl font-semibold mb-4">For Yielders</h2>
                                        <p>Simple, Easy, Effective - Yield vaults of USDC which gives you upto <b>60% APY</b></p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                    </div>
                    <div className='py-5'>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-xl ">
                                <Link
                                    href="/loan?state=lend">
                                    <div className="bg-white p-6 rounded-xl ">
                                        <h2 className="text-2xl font-semibold mb-4">For Lenders</h2>
                                        <p>Earn competitive interest rates by providing liquidity to the community.</p>
                                    </div>
                                </Link>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-xl ">
                                <Link
                                    href="/loan?state=borrow">
                                    <div className="bg-white p-6 rounded-xl ">
                                        <h2 className="text-2xl font-semibold mb-4">For Borrowers</h2>
                                        <p>Access loans backed by cryptocurrency assets at favorable rates.</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <h2 className="font-size: 3rem;">Authentic, Anonymous Hotel Reviews</h2>

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
