import RootLayout from "@/component/layout/Layout";
import Button from "@/extra/Button";
import { openDialog } from "@/store/dialogSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { useRouter } from "next/router";
import { baseURL } from "../utils/config";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getVipPlanBeneFits } from "@/store/vipPlanSlice";
import withdrawRequest from "@/assets/images/withdrawRequest.svg";
import image from "@/assets/images/bannerImage.png";
import VipPlanBenefitDialog from "@/component/VipPlanBenefitDialog";
import randommatch from "@/assets/images/random_match.svg";
import topupcoin_bonus from "@/assets/images/topcoin_bonus.svg";
import videocall_discount from "@/assets/images/videocall_discount.svg";
import audiocall_discount from "@/assets/images/audiocall_discount.svg";
import message from "@/assets/images/message.svg";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { isLoading, isSkeleton } from "@/utils/allSelector";



interface BannerData {
    _id: string;
    image: string;
    isActive: false;
}

const VipPlanPrevilage = ({ type }: any) => {
    const { dialogue, dialogueType } = useSelector(
        (state: RootStore) => state.dialogue
    );

    const roleSkeleton = useSelector<any>(isSkeleton);

  
    const { vipPlanBenefits }: any = useSelector((state: RootStore) => state.vipPlan);
    const router = useRouter();

    const dispatch = useAppDispatch();

    const [data, setData] = useState<any[]>([]);


    useEffect(() => {
        dispatch(getVipPlanBeneFits());
    }, [dispatch]);

    useEffect(() => {
        setData(vipPlanBenefits);
    }, [vipPlanBenefits]);

    const vipBenefits = [
        {
            title: "VIP Frame Badge",
            value: "Frame",
            icon: baseURL + (vipPlanBenefits?.vipFrameBadge || "").replace(/\\/g, "/"),
        },

        {
            title: "Audio Call Discount",
            value: vipPlanBenefits?.audioCallDiscount,
            icon: audiocall_discount.src,
        },
        {
            title: "Video Call Discount",
            value: vipPlanBenefits?.videoCallDiscount,
            icon: videocall_discount.src,
        },
        {
            title: "Random Match Discount.",
            value: vipPlanBenefits?.randomMatchCallDiscount,
            icon: randommatch.src,
        },
        {
            title: "TopUp Coin Bonus",
            value: vipPlanBenefits?.topUpCoinBonus,
            icon: topupcoin_bonus.src,
        },
        {
            title: "Free Messages",
            value: vipPlanBenefits?.freeMessages,
            icon: message.src,
        },
    ];





    return (
        <>
            {dialogueType === "banner" && <VipPlanBenefitDialog />}
            <>
                <div className="d-flex justify-content-between align-items-center">
                    <div
                        className="title text-capitalized fw-600"
                        style={{ color: "#404040", fontSize: "20px" }}
                    >
                    </div>
                    <div className="betBox">
                        <Button
                            className={`bg-button p-10 text-white m10-bottom `}
                            bIcon={image}
                            text="Edit"
                            onClick={() => {
                                dispatch(openDialog({ type: "banner", data: vipPlanBenefits }));
                            }}
                        />
                    </div>
                </div>
                <div className="mainDashbox1">
                    <div className="row"
                        style={{
                            rowGap: "25px"
                        }}
                    >
                        {vipBenefits.map((card, index) => (
                            <div
                                key={index}
                                // className="col-lg-6 col-xl-2 col-md-6 col-sm-6 col-12 p-0"
                                style={{
                                    borderRadius: "20px",
                                    maxWidth: "250px",
                                    height: "280px"
                                }}
                            >
                                {roleSkeleton ? (
                                    <div style={{
                                        width: 200,
                                        height: 280,
                                        borderRadius: 20,
                                        backgroundColor: "#f3f4fb",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        padding: 20,
                                        boxSizing: "border-box",
                                        boxShadow: "0 0 8px #e0e2f5",
                                        gap: 20,
                                    }}>
                                        {/* Skeleton for icon container */}
                                        <div style={{
                                            width: 72,
                                            height: 72,
                                            borderRadius: 16,
                                            backgroundColor: "#d7d8ef",
                                            position: "relative",
                                            overflow: "hidden",
                                        }}>
                                            {/* Skeleton shimmer effect */}
                                            <div className="shimmer" style={{
                                                width: "100%",
                                                height: "100%",
                                                background: "#e2e5e7",
                                                backgroundSize: "200% 100%",
                                                animation: "shimmer 1.5s infinite",
                                                borderRadius: 16,
                                            }} />
                                        </div>

                                        {/* Skeleton for subtitle text */}
                                        <div style={{
                                            width: 100,
                                            height: 12,
                                            backgroundColor: "#e2e5e7",
                                            borderRadius: 6,
                                        }} />

                                        {/* Skeleton for big number text */}
                                        <div style={{
                                            width: 80,
                                            height: 28,
                                            backgroundColor: "#e2e5e7",
                                            borderRadius: 6,
                                        }} />

                                        <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
                                    </div>
                                ) : (
                                    <DashBox
                                        title={card.title}
                                        dashSVG={<img src={card.icon} width={70} height={70} />}
                                        amount={card.value}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </>
        </>
    );
};
VipPlanPrevilage.getLayout = function getLayout(page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};
export default VipPlanPrevilage;


const DashBox = ({ dashIcon, dashSVG, title, amount, onClick }: any) => {
    return (
        <div className="vipplanbenefitBox" onClick={onClick}>
            <div className="dashIconBox midBox">
                <div className="vipplanbenefitIcon vipplanbenefitsvg midBox d-flex justify-content-center">
                    {dashIcon ? <i className={`${dashIcon}`}></i> : dashSVG}
                </div>
            </div>
            <div className="boxContent text-center col-xl-12 col-md-7 col-6">
                <div className="boxTitle midBox1">
                    <p className="text-decoration-underline">{title}</p>
                </div>
                <div className="boxAmount midBox1 mt-2 pb-4">
                    <p>{amount}</p>
                </div>
            </div>
        </div>
    );
};





