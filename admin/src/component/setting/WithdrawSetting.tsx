import Button from "@/extra/Button";

import Table from "@/extra/Table";

import {
  activeWithdrawMethod,
  deleteWithdrawMethod,
  getSetting,
  getWithdrawMethod,
  updateSetting,
} from "@/store/settingSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { openDialog } from "@/store/dialogSlice";
import ToggleSwitch from "@/extra/TogggleSwitch";
import AddWithdrawDialogue from "./AddWithdrawDialogue";
import image from "@/assets/images/bannerImage.png";
import EditIcon from "@/assets/images/edit.svg";
import Image from "next/image";
import { baseURL } from "@/utils/config";
import TrashIcon from "@/assets/images/delete.svg";
import { ExInput } from "@/extra/Input";
import CommonDialog from "@/utils/CommonDialog";
import { isSkeleton } from "@/utils/allSelector";

interface ErrorState {
  minWithdrawalRequestedCoin: string;
  minCoinsForAgencyPayout: string;
  minCoinsForHostPayout: string;

}

interface SettingState {
  setting: {
    minCoinsForHostPayout: number;
    minCoinsForAgencyPayout: number;
    // ... other fields
  } | null; // or undefined
  withdrawSetting: any; // adjust as needed
}


const WithdrawSetting = () => {
  const { setting }: any = useSelector(
    (state: SettingState) => state.setting
  );

  const roleSkeleton = useSelector(isSkeleton);

  const { withdrawSetting } = useSelector(
    (state: RootStore) => state.setting
  );
 
  const { dialogue, dialogueType } = useSelector(
    (state: RootStore) => state.dialogue
  );

  const dispatch = useAppDispatch();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [minCoinsForAgencyPayout, setminCoinsForAgencyPayout] =
    useState<any>();
  const [minCoinsForHostPayout, setminCoinsForHostPayout] =
    useState<any>();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);


  const [error, setError] = useState<any>({
    minWithdrawalRequestedCoin: "",
    minCoinsForAgencyPayout: ""
  });

  useEffect(() => {
    let payload: any = {};
    dispatch(getWithdrawMethod());
    dispatch(getSetting(payload));
  }, [dispatch]);

  useEffect(() => {
    setminCoinsForHostPayout(setting?.minCoinsForHostPayout);
    setminCoinsForAgencyPayout(setting?.minCoinsForAgencyPayout)
  }, [setting]);

  useEffect(() => {
    setData(withdrawSetting);
  }, [withdrawSetting]);

  const handleEdit = (row: any, type: any) => {

    dispatch(openDialog({ type: type, data: row }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!minCoinsForAgencyPayout || !minCoinsForHostPayout) {
      {
        let error = {} as ErrorState;
        if (!minCoinsForAgencyPayout)
          error.minCoinsForAgencyPayout =
            "Minimum withdrawal amount is required";
        if (!minCoinsForHostPayout)
          error.minCoinsForHostPayout =
            "Minimum Payout amount is required";

        return setError({ ...error });
      }
    } else {
      let settingDataSubmit = {
        minCoinsForAgencyPayout: minCoinsForAgencyPayout,
        minCoinsForHostPayout: minCoinsForHostPayout,
      };

      const payload = {
        settingId: setting?._id,
        settingDataSubmit
      }
      dispatch(updateSetting(payload));
    }
  };

  const withdrawTable = [
    {
      Header: "No",
      body: "name",
      Cell: ({ index }: { index: number }) => <span>{(page - 1) * size + index + 1}</span>,
    },
    {
      Header: "Image",
      body: "image",
      Cell: ({ row, index }: { row: any, index: number }) => (
        <img src={baseURL + row?.image} style={{ objectFit: "cover", width: "100px" }} />
      ),
    },
    {
      Header: "Name",
      body: "name",
      Cell: ({ row }: { row: any }) => <span className="text-capitalize">{row?.name}</span>,
    },


    {
      Header: "Details",
      body: "details",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">
          <ul>
            {row?.details?.map((detail: any, index: number) => (
              <>
                <span></span>
                <li>{`${detail}`}</li>
              </>
            ))}
          </ul>
        </span>
      ),
    },
    {
      Header: "Created Date",
      body: "createdAt",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">
          {row?.createdAt ? dayjs(row?.createdAt).format("DD MMMM YYYY") : ""}
        </span>
      ),
    },
    {
      Header: "IsActive",
      body: "isActive",
      Cell: ({ row }: { row: any }) => (
        <ToggleSwitch
          onClick={() => handleIsActive(row?._id)}
          value={row?.isActive}
        />
      ),
    },
    {
      Header: "Action",
      body: "action",
      Cell: ({ row }: { row: any }) => (
        <div className="action-button">
          <button
            className="me-2"
            style={{ backgroundColor: "#CFF3FF", borderRadius: "8px", padding: "8px" }}
            onClick={() => {
              dispatch(openDialog({ type: "withdraw", data: row }));
            }}
          >
            <img
              src={EditIcon.src}
              alt="Edit Icon"
              width={22}
              height={22}
            />
          </button>

          <button
            style={{ backgroundColor: "#FFE7E7", borderRadius: "8px", padding: "8px" }}
            onClick={() => handleDelete(row?._id)}
          >
            <img
              src={TrashIcon.src}
              alt="Trash Icon"
              width={22}
              height={22}
            />
          </button>
        </div>
      ),
    },
  ];



  const handleDelete = (id: any) => {

    setSelectedId(id);
    setShowDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedId) {
      dispatch(deleteWithdrawMethod(selectedId));
      setShowDialog(false);
    }
  };



  const handleIsActive = (id: any) => {

    dispatch(activeWithdrawMethod(id));
  };

  return (
    <>
      {dialogueType === "withdraw" && <AddWithdrawDialogue />}
      <CommonDialog
        open={showDialog}
        onCancel={() => setShowDialog(false)}
        onConfirm={confirmDelete}
        text={"Delete"}
      />
      <div className="row">
        <div className="col-6">
          <div
            className="withdrawal-box payment-setting mt-3"
            style={{
              border: "1px solid #cfcfcf",
              padding: "15px",
              borderRadius: "10px",
            }}
          >
            {
              roleSkeleton ?
              <>
                  {/* Title */}
                  <div className="d-flex justify-content-between align-item-center">
                  <div
                    className="skeleton mb-4"
                    style={{ height: "24px", width: "40%"}}
                  ></div>

                  <div className="d-flex justify-content-end mb-3">
                    <div
                      className="skeleton"
                      style={{
                        height: "38px",
                        width: "80px",
                        borderRadius: "6px",
                      }}
                    ></div>
                  </div>

                  </div>

                  {["Minimum Withdrawal Coin (Agency)", "Minimum Withdrawal Coin (Host)"].map(
                    (_, index) => (
                      <div className="mb-4" key={index}>
                        {/* Label skeleton */}
                        <div
                          className="skeleton mb-2"
                          style={{ height: "16px", width: "50%",}}
                        ></div>

                        {/* Input skeleton */}
                        <div
                          className="skeleton"
                          style={{
                            height: "40px",
                            width: "100%",
                            borderRadius: "8px",
                          }}
                        ></div>
                      </div>
                    )
                  )}

                  <div
                    className="skeleton"
                    style={{
                      height: "14px",
                      width: "80%",
                      borderRadius: "4px",
                    }}
                  ></div>
                  </>
                :

                <>
                  <div className="row align-items-center p-2">
                    <div className="col-12 col-sm-6 fw-bold fs-20"
                      style={{
                        fontSize: "20px",
                        paddingLeft: "2px"
                      }}
                    >
                      Minimum Withdrawal Limit
                    </div>
                    <div className="col-12 col-sm-6 sm-m-0 d-flex justify-content-end p-0">
                      <Button
                        type={`submit`}
                        className={` text-white m10-left`}
                        style={{ backgroundColor: "#1ebc1e" }}
                        text={`Submit`}
                        onClick={handleSubmit}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div
                      className="col-12 withdrawal-input mt-1"
                      style={{
                        borderTop: "1px solid #dbdbdb",
                      }}
                    >
                      <label
                        style={{
                          color: "#404040",
                          fontWeight: 600,
                          fontSize: "15px",
                          marginTop: "10px",
                        }}
                      >
                        Minimum Withdrawal Coin (Agency)
                      </label>

                      <div className="col-12">
                        <ExInput
                          type={`number`}
                          id={`amount`}
                          name={`Amount`}
                          placeholder={`Enter Amount`}
                          errorMessage={
                            error.minCoinsForAgencyPayout &&
                            error.minCoinsForAgencyPayout
                          }
                          value={minCoinsForAgencyPayout}
                          onChange={(e: any) => {
                            setminCoinsForAgencyPayout(parseInt(e.target.value));
                            if (!e.target.value) {
                              return setError({
                                ...error,
                                minCoinsForAgencyPayout: `Minimum withdrawal coin (Agency) is required`,
                              });
                            } else if (e.target.value <= 0) {
                              return setError({
                                ...error,
                                minCoinsForAgencyPayout: `Minimum withdrawal coin (Agency) can not less than 0`,
                              });
                            }

                            else {
                              return setError({
                                ...error,
                                minCoinsForAgencyPayout: "",
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className="col-12 withdrawal-input mt-1"
                      style={{
                        borderTop: "1px solid #dbdbdb",
                      }}
                    >
                      <label
                        style={{
                          color: "#404040",
                          fontWeight: 600,
                          fontSize: "15px",
                          marginTop: "10px",
                        }}
                      >
                        Minimum Withdrawal Coin (Host)
                      </label>

                      <div className="col-12">
                        <ExInput
                          type={`number`}
                          id={`amount`}
                          name={`Amount`}
                          placeholder={`Enter Amount`}
                          errorMessage={
                            error.minCoinsForHostPayout &&
                            error.minCoinsForHostPayout
                          }
                          value={minCoinsForHostPayout}
                          onChange={(e: any) => {
                            setminCoinsForHostPayout(parseInt(e.target.value));
                            if (!e.target.value) {
                              return setError({
                                ...error,
                                minCoinsForHostPayout: `Minimum Payout coin (Host) is required`,
                              });
                            } else if (e.target.value <= 0) {
                              return setError({
                                ...error,
                                minCoinsForHostPayout: `Minimum withdrawal coin (Host) can not less than 0`,
                              });
                            }

                            else {
                              return setError({
                                ...error,
                                minCoinsForHostPayout: "",
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                    <h6
                      style={{
                        color: "#666",
                        fontSize: "14px",
                        fontWeight: 400,
                        marginTop: "7px",
                      }}
                    >
                      {/* User can not post withdraw request less than this amount */}
                      Agency or Host can not withdraw request less than these coin
                    </h6>
                  </div>
                </>
            }

          </div>
        </div>
      </div>
      <div className="userPage withdrawal-page p-0">
        <div className="dashboardHeader primeHeader mb-3 p-0"></div>
        <div className="row">
          <div className="col-6">
            <div className="withdrawal-box payment-setting ">
              <div className="row align-items-center p-2">
                <div className="col-12 col-sm-6 "></div>
              </div>
            </div>
          </div>
        </div>

        <div className="payment-setting-box user-table mt-3">
          <div className="row align-items-center mb-2 p-3 ml-1">
            <div className="col-12 col-sm-6 col-md-6 col-lg-6">
              <h5 className="mb-0">Withdraw Payment Method</h5>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-6 new-fake-btn d-flex justify-content-end mt-3 m-sm-0">
              <Button
                className={`bg-button p-10 text-white m10-bottom `}
                bIcon={image}
                text="Add"
                onClick={() => {
                  dispatch(openDialog({ type: "withdraw" }));
                }}
              />
            </div>
          </div>
          <div className="mt-3">
            <Table
              data={withdrawSetting}
              mapData={withdrawTable}
              type={"server"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default WithdrawSetting;