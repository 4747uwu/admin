import Navigator from "@/extra/Navigator";
import { useEffect, useState } from "react";
import logo from "../../assets/images/logo.png";
import sideBarLogo from "../../assets/images/logo.png"
import { useRouter } from "next/navigation";
import { warning } from "@/utils/Alert";
import Image from "next/image";
import $ from "jquery";
import { projectName } from "@/utils/config";
import hostRequest from "@/assets/images/hostRequest.png";
import giftCategory from "@/assets/images/giftCategory.svg";
import gift from "@/assets/images/gift.svg";
import impression from "@/assets/images/impression.svg";
import plan from "@/assets/images/plan1.svg";
import dailycheckInReward from "@/assets/images/dailyCheckInReward.svg";
import user from "@/assets/images/user.svg";
import agency from "@/assets/images/agency1.png";
import host from "@/assets/images/host.svg";
import withdrawRequest from "@/assets/images/withdrawRequest.svg";
import vipPlanBenefits from "@/assets/images/vipplan_benefits.svg";

import logout from "@/assets/images/Log Out.svg";
import CommonDialog from "@/utils/CommonDialog";
import { toast } from "react-toastify";

const Sidebar = () => {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);

  const handleLogout = () => {
    setShowDialog(true);
  };

  const handleOnClick = () => {
    window && localStorage.removeItem("dialog");
  };


  const confirmLogout = async () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("admin");
    sessionStorage.removeItem("key");
    sessionStorage.removeItem("isAuth");
    sessionStorage.setItem("isAgency", "false");
    setTimeout(() => {
      router.push("/");
    }, 1000);
    toast.success("Logout successful");
  };

  const genralMenu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      navSVG: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_895_315)">
            <path
              d="M24 10.5522C24 11.8287 24 13.1045 24 14.3809C23.9898 14.4418 23.9731 14.5026 23.9705 14.5641C23.9027 16.0877 23.7176 17.598 23.4511 19.0992C23.3032 19.9318 23.0861 20.7401 22.616 21.4561C21.9262 22.5064 20.8963 23.0515 19.7185 23.3506C18.2499 23.7233 16.741 23.7983 15.2391 23.9193C14.8606 23.95 14.4808 23.9731 14.1023 23.9994C12.7484 23.9994 11.3944 23.9994 10.0399 23.9994C9.97134 23.9891 9.90281 23.9725 9.83364 23.9693C8.33304 23.9071 6.83821 23.7771 5.3549 23.5408C4.4352 23.3948 3.55072 23.1303 2.75975 22.6115C1.66008 21.8903 1.11377 20.815 0.833244 19.5789C0.441282 17.8541 0.209435 16.107 0.121692 14.3393C0.042275 12.7362 0.051882 11.1363 0.221604 9.53903C0.262594 9.15539 0.334325 8.79353 0.594352 8.48099C0.983753 8.01217 1.4103 7.58178 1.8599 7.17445C4.40125 4.87263 7.1309 2.80586 9.88552 0.772397C11.1985 -0.196621 13.0308 -0.178048 14.347 0.785846C16.7762 2.56569 19.176 4.3846 21.4593 6.35145C22.208 6.9964 22.9452 7.65479 23.5715 8.42527C23.8072 8.7154 23.9219 9.03499 23.9251 9.41222C23.9276 9.79393 23.9731 10.1731 24 10.5522ZM7.03867 18.7316C7.03867 17.899 7.03803 17.0664 7.03867 16.2338C7.04059 14.5699 8.43488 13.1397 10.1014 13.1186C11.4002 13.1019 12.7003 13.1013 13.9992 13.1186C15.667 13.141 17.0529 14.5679 17.0542 16.2395C17.0548 17.1189 17.0542 17.9976 17.0542 18.877C17.0542 19.7326 17.0561 20.5889 17.0529 21.4446C17.0523 21.6136 17.092 21.7174 17.2905 21.6905C17.9758 21.5996 18.6618 21.5201 19.3342 21.3427C20.4371 21.052 21.1038 20.375 21.3357 19.2484C21.7341 17.3149 21.9198 15.3595 21.9723 13.3908C22.0037 12.2245 21.9749 11.0582 21.8974 9.89256C21.8826 9.66648 21.8147 9.49548 21.661 9.33536C21.182 8.83388 20.6683 8.36955 20.1438 7.91866C17.931 6.01457 15.6029 4.25586 13.2569 2.5215C12.5076 1.9675 11.6967 1.96173 10.948 2.51893C8.82556 4.09831 6.72292 5.70267 4.69587 7.40437C3.91514 8.05956 3.14083 8.72244 2.4408 9.46602C2.32424 9.58963 2.26147 9.72284 2.24098 9.89705C2.16989 10.5004 2.13722 11.1062 2.12121 11.7115C2.0719 13.6124 2.18846 15.5043 2.49076 17.3828C2.6118 18.1347 2.72645 18.8898 2.96214 19.6167C3.15556 20.213 3.48796 20.7061 4.05989 21.0097C4.35706 21.1672 4.66769 21.2864 4.99176 21.3741C5.56433 21.5291 6.15035 21.6008 6.73765 21.6674C7.01882 21.6995 7.03611 21.6931 7.03675 21.4151C7.03931 20.521 7.03867 19.6263 7.03867 18.7316ZM15.0175 18.9205C15.0175 18.0341 15.0041 17.1471 15.0227 16.2613C15.0329 15.7643 14.4879 15.1591 13.9307 15.1719C12.6715 15.2007 11.4111 15.1988 10.152 15.1725C9.64215 15.1616 9.07021 15.708 9.07278 16.2485C9.07918 18.045 9.07662 19.8408 9.07278 21.6373C9.07214 21.8147 9.13426 21.8833 9.31423 21.8948C11.1242 22.0114 12.9335 22.012 14.7434 21.8993C14.9548 21.8858 15.0239 21.8141 15.022 21.6034C15.0131 20.7087 15.0182 19.8146 15.0175 18.9205Z"
              fill="#092C1C"
            />
          </g>
          <defs>
            <clipPath id="clip0_895_315">
              <rect width="26" height="26" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
     {
      name: "User",
      path: "/User/User",
      path4: "/User/UserInfoPage",
      path2: "/User/CoinPlanHistoryPage",
      path3: "/PurchaseCoinPlanHistory",
      navSVG: (
        <img
          src={user.src}
          height={24}
          width={24}
          style={{ objectFit: "contain" }}
          className="image"
        />
      ),
      onClick: handleOnClick,
    },

    
  ];

  const giftAndRewards = [
    
{
      name: "Gift Category",
      path: "/GiftCategory",
      navSVG: (

        <img
          src={giftCategory.src}
          height={26}
          width={26}
          style={{ objectFit: "contain" }}
          className="image"
        />
      ),
      onClick: handleOnClick,
    },

    {
      name: "Gift",
      path: "/GiftPage",
      navSVG: (
        <img
          src={gift.src}
          height={24}
          width={24}
          style={{ objectFit: "contain" }}
          className="image"
        />
      ),
      onClick: handleOnClick,
    },
    {
      name: "Daily CheckIn",
      path: "/DailyCheckInReward",
      navSVG: (
        <img
          src={dailycheckInReward.src}
          height={24}
          width={24}
          style={{ objectFit: "contain" }}
          className="image"
        />
      ),
      onClick: handleOnClick,
    },
   

  ]

  const packages = [
   {
      name: "Plan",
      path: "/Plan",
      navSVG: (
        <img
          src={plan.src}
          height={24}
          width={24}
          style={{ objectFit: "contain" }}
          className="image"
        />
      ),
      onClick: handleOnClick,
    },

    {
      name: "Vip Plan Benefits",
      path: "/VipPlanPrevilage",
      navSVG: (
        <img
          src={vipPlanBenefits.src}
          height={24}
          width={24}
          style={{ objectFit: "contain" }}
          className="image"
        />
      ),
      onClick: handleOnClick,
    },
  ]

  const finance = [
    {
      name: "Withdrawal",
      path: "/WithdrawRequest",
      navSVG: (
        <img
          src={withdrawRequest.src}
          height={24}
          width={24}
          style={{ objectFit: "contain" }}
          className="image"
        />
      ),
      onClick: handleOnClick,
    },
  ]


  const setting = [
    {
      name: "Setting",
      path: "/Setting",
      navSVG: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.4981 16.5834C9.97081 16.5834 7.91467 14.5273 7.91467 12C7.91467 9.47277 9.97081 7.41663 12.4981 7.41663C15.0252 7.41663 17.0813 9.47277 17.0813 12C17.0813 14.5273 15.0252 16.5834 12.4981 16.5834ZM12.4981 8.79163C10.7288 8.79163 9.28967 10.2309 9.28967 12C9.28967 13.7691 10.7288 15.2084 12.4981 15.2084C14.2672 15.2084 15.7063 13.7691 15.7063 12C15.7063 10.2309 14.2672 8.79163 12.4981 8.79163Z"
            fill="#092C1C"
          />
          <path
            d="M14.0224 23H10.9734C10.2401 23 9.59208 22.4793 9.43258 21.7616L9.04672 20.0456C8.41779 19.7788 7.81824 19.4306 7.25548 19.0053L5.58438 19.5331C4.86749 19.7559 4.08838 19.4516 3.72899 18.8099L2.20932 16.1819C1.84524 15.531 1.96813 14.7298 2.50357 14.2257L3.79865 13.0349C3.75937 12.6857 3.74008 12.3392 3.74008 12C3.74008 11.6608 3.75942 11.3143 3.79783 10.9651L2.50993 9.77989C1.96809 9.27015 1.84443 8.469 2.20463 7.82653L3.73372 5.18189C4.08838 4.54746 4.86938 4.24599 5.58168 4.46504L7.25548 4.9939C7.81824 4.5686 8.41779 4.22029 9.04672 3.95341L9.43344 2.2357C9.59208 1.5207 10.2401 1 10.9734 1H14.0224C14.7557 1 15.4037 1.52065 15.5632 2.23836L15.9491 3.95445C16.578 4.22115 17.1776 4.56941 17.7403 4.99472L19.4114 4.46689C20.1302 4.24599 20.9074 4.54845 21.2668 5.19014L22.7867 7.81811C23.1505 8.469 23.0277 9.27015 22.4922 9.77435L21.1972 10.9651C21.2356 11.3143 21.2549 11.6618 21.2549 12C21.2549 12.3382 21.2356 12.6857 21.1972 13.0349L22.4859 14.2193C22.4877 14.2211 22.4896 14.2229 22.4922 14.2248C22.7526 14.4694 22.9234 14.7941 22.9776 15.1472C23.0318 15.5002 22.9662 15.8613 22.7912 16.1727L21.2621 18.8172C20.9074 19.4516 20.1283 19.755 19.4133 19.5331L17.7393 19.0042C17.1765 19.4296 16.577 19.7779 15.9482 20.0447L15.5613 21.7625C15.4037 22.4793 14.7557 23 14.0224 23ZM7.39577 17.5541C7.55338 17.5541 7.70833 17.6081 7.83302 17.7108C8.46277 18.2288 9.14929 18.6284 9.87619 18.8961C9.98383 18.9358 10.0798 19.0018 10.1554 19.0881C10.231 19.1744 10.2838 19.2782 10.3089 19.3901L10.7756 21.4618C10.7965 21.5572 10.88 21.625 10.9744 21.625H14.0232C14.1177 21.625 14.2011 21.5572 14.2213 21.4637L14.6887 19.3901C14.7139 19.2782 14.7667 19.1744 14.8422 19.0881C14.9178 19.0018 15.0138 18.9358 15.1214 18.8961C15.8474 18.6284 16.5349 18.2288 17.1646 17.7108C17.2529 17.6376 17.3582 17.5877 17.4708 17.5658C17.5835 17.5439 17.6998 17.5505 17.8091 17.5853L19.8267 18.2224C19.9228 18.2526 20.0256 18.2168 20.0695 18.138L21.5986 15.4934C21.6445 15.4118 21.6278 15.3 21.5547 15.2285L20.0073 13.8058C19.9246 13.7298 19.8618 13.6346 19.8244 13.5287C19.787 13.4227 19.7761 13.3092 19.7928 13.1981C19.8532 12.792 19.8836 12.3887 19.8836 11.9991C19.8836 11.6094 19.8532 11.2061 19.7928 10.8001C19.7762 10.6889 19.7871 10.5755 19.8245 10.4695C19.8618 10.3636 19.9246 10.2684 20.0073 10.1923L21.5582 8.76591C21.6278 8.70099 21.6445 8.58716 21.5939 8.4965L20.0741 5.8684C20.0247 5.78126 19.9202 5.74654 19.8248 5.77675L17.81 6.4129C17.5881 6.48354 17.3462 6.43589 17.1656 6.28735C16.5359 5.76936 15.8492 5.36971 15.1223 5.10201C15.0147 5.06237 14.9187 4.99639 14.8431 4.9101C14.7675 4.82381 14.7148 4.71996 14.6897 4.60804L14.2231 2.5363C14.2001 2.4428 14.1167 2.375 14.0224 2.375H10.9734C10.8791 2.375 10.7957 2.4428 10.7755 2.5363L10.3079 4.60989C10.2827 4.72175 10.2299 4.82552 10.1544 4.91179C10.0788 4.99805 9.98292 5.06408 9.87537 5.10386C9.14929 5.37155 8.46179 5.77121 7.83302 6.2892C7.65243 6.43774 7.40854 6.4844 7.18867 6.41475L5.17098 5.77757C5.07667 5.74835 4.97208 5.78315 4.92812 5.862L3.39904 8.50561C3.35319 8.5882 3.36982 8.70181 3.44587 8.7733L4.99137 10.1933C5.07408 10.2694 5.13689 10.3645 5.17428 10.4705C5.21168 10.5764 5.22252 10.69 5.20587 10.8011C5.14529 11.2071 5.11508 11.6104 5.11508 12C5.11508 12.3896 5.14529 12.7929 5.20587 13.1989C5.23982 13.4245 5.15904 13.6518 4.99137 13.8067L3.44033 15.2331C3.37063 15.2982 3.35422 15.4118 3.40454 15.5026L4.92443 18.1306C4.9729 18.2177 5.07748 18.2516 5.17365 18.2224L7.18867 17.5861C7.25647 17.5642 7.32617 17.5541 7.39577 17.5541Z"
            fill="#092C1C"
          />
        </svg>
      ),
      onClick: handleOnClick,
    },
    {
      name: "Profile",
      path: "/adminProfile",
      navSVG: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_2794_47)">
            <path d="M11.063 0.00469971H12.937C12.96 0.0628247 13.0134 0.0450122 13.0566 0.051106C13.3964 0.0965747 13.7381 0.128918 14.0756 0.187512C19.1574 1.07486 23.0888 5.10939 23.8655 10.2234C23.9081 10.5033 23.895 10.792 23.9953 11.063V13.0308C23.9334 13.0491 23.9499 13.1034 23.9438 13.1461C23.9002 13.4545 23.8669 13.7653 23.8134 14.0719C22.9209 19.1616 18.8911 23.0892 13.7766 23.865C13.4967 23.9077 13.208 23.8955 12.937 23.9949H11.0161C10.9936 23.9367 10.9411 23.9522 10.8975 23.9461C10.5656 23.9006 10.2319 23.8655 9.90142 23.8092C4.8872 22.9599 0.875637 18.8414 0.136418 13.7963C0.0989185 13.5408 0.122825 13.2727 0.00469971 13.0308V10.9692C0.0665747 10.9509 0.0501685 10.8966 0.0562622 10.8539C0.099856 10.5455 0.133137 10.2347 0.186575 9.92814C1.07767 4.83986 5.11454 0.905168 10.2234 0.134543C10.5033 0.092356 10.792 0.104543 11.063 0.00469971ZM19.7939 18.2372C22.7733 14.6508 22.9228 8.74782 19.013 4.87829C15.1589 1.06361 8.89267 1.04908 5.01892 4.84689C1.09407 8.69439 1.20236 14.6156 4.20095 18.2306C4.32986 18.0544 4.45032 17.873 4.5872 17.7047C5.50454 16.5792 6.71767 15.8963 8.06204 15.4275C9.95485 14.767 11.9011 14.6231 13.8778 14.9156C15.3188 15.1289 16.6781 15.5827 17.9124 16.3767C18.6699 16.8638 19.3102 17.4699 19.7944 18.2372H19.7939ZM11.9709 21.997C14.2266 21.9844 16.2459 21.3117 18.0375 19.9617C18.3342 19.7381 18.3366 19.7363 18.1528 19.4058C17.7431 18.6684 17.1047 18.1791 16.3777 17.7928C14.9142 17.0156 13.3383 16.7391 11.6995 16.7831C10.2225 16.8225 8.80735 17.1338 7.50423 17.8584C6.79126 18.255 6.17626 18.757 5.79095 19.5024C5.69907 19.68 5.71548 19.7775 5.88048 19.9036C7.68329 21.2827 9.7172 21.9769 11.9705 21.997H11.9709Z" fill="#3F4B5A" />
            <path d="M7.40014 9.27469C7.3978 6.705 9.45421 4.64672 12.0183 4.65141C14.5387 4.65609 16.5881 6.72047 16.6026 9.24422C16.6167 11.663 14.6958 13.7995 12.1191 13.8581C9.37124 13.9205 7.37155 11.6897 7.40014 9.27469ZM11.9916 11.8523C13.4597 11.8434 14.617 10.6898 14.61 9.24234C14.603 7.81453 13.418 6.64734 11.9826 6.65531C10.5445 6.66328 9.37827 7.84219 9.39046 9.27562C9.40218 10.7123 10.5619 11.8608 11.9916 11.8523Z" fill="#3F4B5A" />
          </g>
          <defs>
            <clipPath id="clip0_2794_47">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
      onClick: handleOnClick,
    },
    {
      name: "LogOut",
      navSVG: (
        <img
          src={logout.src}
          height={24}
          width={24}
          style={{ objectFit: "contain" }}
          className="image"
        />

      ),
      onClick: handleLogout,
    },
  ];

  const hostAndAgency = [
     {
      name: "Agency",
      path: "/Agency",
      path2: "/Host/AgencyWiseHost",

      navSVG: (
        <img
          src={agency.src}
          height={24}
          width={24}
          style={{ objectFit: "contain" }}
          className="image"
        />
      ),
      onClick: handleOnClick,
    },
     {
      name: "Host",
      path: "/Host",
      path2: "/Host/HostInfoPage",
      path3: "/Host/HostHistoryPage",
      navSVG: (
        <img
          src={host.src}
          height={24}
          width={24}
          style={{ objectFit: "contain" }}
          className="image"
        />
      ),
      onClick: handleOnClick,
    },
    {
      name: "Host Request",
      path: "/HostRequest",
      path2: "/HostProfile",
      navSVG: (


        <img
          src={hostRequest.src}
          height={26}
          width={26}
          style={{ objectFit: "contain" }}
          className="image"
        />

      ),
    },
    {
      name: "Host Tags",
      path: "/Impression",
      navSVG: (
        <img
          src={impression.src}
          height={24}
          width={24}
          style={{ objectFit: "contain" }}
          className="image"
        />
      ),
      onClick: handleOnClick,
    },
    
  ]

  // const screen = typeof window !== "undefined" && window;

  // const webSize = $(screen).width();
  return (
    <>
      <CommonDialog
        open={showDialog}
        onCancel={() => setShowDialog(false)}
        onConfirm={confirmLogout}
        text={"LogOut"}
      />
      <div className="mainSidebar">
        <SideMenuJS />
        <div className="sideBar" style={{ marginBottom: "40px" }}>
          <div style={{
            paddingLeft: "0px", background: "#8F6DFF",
            position: "sticky", top: "0"
          }}>
            <div className="sideBarLogo">
              <div className="logo d-flex justify-content-center " style={{alignItems : 'center'}}>
                {/* <img src={Logo} alt="logo" /> */}
                <div style={{ width: "50px" }}>
                  <img src={sideBarLogo.src} width={40} height={40} alt="" />
                </div>
                <h3
                  className="cursor text-nowrap mb-0 ms-1 "
                  style={{ color: "#FFF", fontSize: "40px" }}
                // onClick={() => router("/admin/adminDashboard")}
                >
                  {projectName}
                </h3>
              </div>
              {/* <div className="smallLogo">
            <img src={""} alt="logo" className="smallLogo" />
          </div> */}
              <i className="ri-close-line closeIcon navToggle"></i>
              <div className="blackBox navToggle"></div>
            </div>
          </div>
          {/* ======= Navigation ======= */}
          <div className="navigation">
            <nav style={{ marginBottom: "30px" }}>
              {/* About */}
              <ul className={`mainMenu webMenu`}>
                <p className="navTitle">General</p>

                {genralMenu.map((res: any, i: any) => {
                  return (
                    <>
                      <Navigator
                        name={res?.name}
                        path={res?.path}
                        path2={res?.path2}
                        path3={res?.path3}
                        path4={res?.path4}
                        navIcon={res?.navIcon}
                        navSVG={res?.navSVG}
                        onClick={res?.onClick && res?.onClick}
                      >
                        {res?.subMenu && (
                          <ul className={`subMenu`}>
                            <span className="subhead">{res?.name}</span>
                            {res?.subMenu?.map((subMenu: any) => {
                              return (
                                <Navigator
                                  name={subMenu.subName}
                                  path={subMenu.subPath}
                                  onClick={subMenu.onClick}
                                  key={subMenu.subPath}
                                />
                              );
                            })}
                          </ul>
                        )}
                      </Navigator>
                    </>
                  );
                })}


                <p className="navTitle">Host & Agency</p>

                {hostAndAgency.map((res: any, i: any) => {
                  return (
                    <>
                      <Navigator
                        name={res?.name}
                        path={res?.path}
                        path2={res?.path2}
                        path3={res?.path3}
                        path4={res?.path4}
                        navIcon={res?.navIcon}
                        navSVG={res?.navSVG}
                        onClick={res?.onClick && res?.onClick}
                      >
                        {res?.subMenu && (
                          <ul className={`subMenu`}>
                            <span className="subhead">{res?.name}</span>
                            {res?.subMenu?.map((subMenu: any) => {
                              return (
                                <Navigator
                                  name={subMenu.subName}
                                  path={subMenu.subPath}
                                  onClick={subMenu.onClick}
                                  key={subMenu.subPath}
                                />
                              );
                            })}
                          </ul>
                        )}
                      </Navigator>
                    </>
                  );
                })}


                <p className="navTitle">Gift & Rewards</p>


                {giftAndRewards.map((res: any, i: any) => {
                  return (
                    <>
                      <Navigator
                        name={res?.name}
                        path={res?.path}
                        path2={res?.path2}
                        path3={res?.path3}
                        path4={res?.path4}
                        navIcon={res?.navIcon}
                        navSVG={res?.navSVG}
                        onClick={res?.onClick && res?.onClick}
                      >
                        {res?.subMenu && (
                          <ul className={`subMenu`}>
                            <span className="subhead">{res?.name}</span>
                            {res?.subMenu?.map((subMenu: any) => {
                              return (
                                <Navigator
                                  name={subMenu.subName}
                                  path={subMenu.subPath}
                                  onClick={subMenu.onClick}
                                  key={subMenu.subPath}
                                />
                              );
                            })}
                          </ul>
                        )}
                      </Navigator>
                    </>
                  );
                })}


                <p className="navTitle">Packages</p>

                {packages.map((res: any, i: any) => {
                  return (
                    <>
                      <Navigator
                        name={res?.name}
                        path={res?.path}
                        path2={res?.path2}
                        path3={res?.path3}
                        path4={res?.path4}
                        navIcon={res?.navIcon}
                        navSVG={res?.navSVG}
                        onClick={res?.onClick && res?.onClick}
                      >
                        {res?.subMenu && (
                          <ul className={`subMenu`}>
                            <span className="subhead">{res?.name}</span>
                            {res?.subMenu?.map((subMenu: any) => {
                              return (
                                <Navigator
                                  name={subMenu.subName}
                                  path={subMenu.subPath}
                                  onClick={subMenu.onClick}
                                  key={subMenu.subPath}
                                />
                              );
                            })}
                          </ul>
                        )}
                      </Navigator>
                    </>
                  );
                })}

                <p className="navTitle">Finance</p>

                {finance.map((res: any, i: any) => {
                  return (
                    <>
                      <Navigator
                        name={res?.name}
                        path={res?.path}
                        path2={res?.path2}
                        path3={res?.path3}
                        path4={res?.path4}
                        navIcon={res?.navIcon}
                        navSVG={res?.navSVG}
                        onClick={res?.onClick && res?.onClick}
                      >
                        {res?.subMenu && (
                          <ul className={`subMenu`}>
                            <span className="subhead">{res?.name}</span>
                            {res?.subMenu?.map((subMenu: any) => {
                              return (
                                <Navigator
                                  name={subMenu.subName}
                                  path={subMenu.subPath}
                                  onClick={subMenu.onClick}
                                  key={subMenu.subPath}
                                />
                              );
                            })}
                          </ul>
                        )}
                      </Navigator>
                    </>
                  );
                })}
                <p className="navTitle">Setting</p>

                {setting.map((res: any, i: any) => {
                  return (
                    <>
                      <Navigator
                        name={res?.name}
                        path={res?.path}
                        navIcon={res?.navIcon}
                        navSVG={res?.navSVG}
                        onClick={res?.onClick && res?.onClick}
                      >
                        {res?.subMenu && (
                          <ul className={`subMenu`}>
                            <span className="subhead">{res?.name}</span>
                            {res?.subMenu?.map((subMenu: any) => {
                              return (
                                <Navigator
                                  name={subMenu.subName}
                                  path={subMenu.subPath}
                                  onClick={subMenu.onClick}
                                  key={subMenu.subPath}
                                />
                              );
                            })}
                          </ul>
                        )}
                      </Navigator>
                    </>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

export const SideMenuJS = () => {
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    $(".subMenu").hide();

    // ============== sidemenu toggle ==================
    const handleNav = (event: any) => {
      const target = event.currentTarget;
      $(".subMenu").not($(target).next(".subMenu")).slideUp();
      $(".mainMenu i").not($(target).children("i")).removeClass("rotate90");
      $(target).next(".subMenu").slideToggle();
      $(target).children("i").toggleClass("rotate90");
    };
    $(".mainMenu.webMenu > li > a").on("click", handleNav);

    // ============== sidebar toggle ==================
    const handleSidebar = () => {
      // Sidemenu Off In Mobile Menu
      $(".subMenu").slideUp();
      $(".mainMenu i").removeClass("rotate90");
      // Mobile Menu Class
      $(".mainAdminGrid").toggleClass("webAdminGrid");
      $(".mainMenu").toggleClass("mobMenu webMenu");
      setMenu(menu ? false : true);
    };
    $(".navToggle").on("click", handleSidebar);

    return () => {
      $(".mainMenu > li > a").off("click", handleNav);
      $(".navToggle").off("click", handleSidebar);
    };
  }, [menu]);
  return null;
};
