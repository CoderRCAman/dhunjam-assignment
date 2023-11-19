import React, { useEffect, useState } from "react";
import { useAuth } from "../store/AuthProvider";
import axios from "axios";
import Barchart from "../components/BarChart";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [update, setUpdate] = useState({
    category_6: 0,
    category_7: 0,
    category_8: 0,
    category_9: 0,
    category_10: 0,
  });
  const [buttonYes, setButtonYes] = useState({
    category_6: true,
    category_7: true,
    category_8: true,
    category_9: true,
    category_10: true,
  });

  async function fetchDashboardData() {
    try {
      const res = await axios.get(
        `https://stg.dhunjam.in/account/admin/${user.id}`
      );
      setDashboardData(res.data.data);
      setDisabled(!res.data.data.charge_customers); //because whatever we get if true means not disable it so ! reversing it
      setUpdate(res.data.data.amount);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const updateCharges = (e) => {
    const minVal = parseInt(e.target.dataset.min);
    setUpdate((update) => {
      return { ...update, [e.target.name]: e.target.value };
    });
    setButtonYes((btnYes) => {
      return { ...btnYes, [e.target.name]: minVal < parseInt(e.target.value) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `https://stg.dhunjam.in/account/admin/${user.id}`,
        {
          amount: update,
        }
      );
      if (res.status == 200) {
        toast.success("Update was successful!");
        fetchDashboardData();
      }
    } catch (error) {
      toast.error("Failed to update retry again!");
      console.log(error);
    }
  };

  function areAllGoodValues() {
    let res = true;
    for (let key in buttonYes) {
      res &= buttonYes[key];
    }
    return res;
  }

  function flattenArrayCharges() {
    let res = [];
    for (let key in update) {
      res.push(update[key]);
    }
    return res;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="text-white flex h-screen w-screen flex-col items-center pt-9 gap-8"
    >
      <h1 className="text-[32px] w-[600px] text-center font-bold">
        {dashboardData?.name}, {dashboardData?.location} on DhunJam
      </h1>
      <div className="flex w-[600px]  gap-24 items-center">
        <div className="w-[55%]  ">
          Do you want to charge your customers for requesting songs?
        </div>
        <div className="space-x-8 flex">
          <div className="flex items-center gap-1">
            <input
              type="radio"
              name="charge"
              className="border-0  w-full scale-125 mr-1 accent-[#6741D9]"
              checked={disabled == false}
              onChange={(e) => {
                console.log("first-radio", e.target.value);
                setDisabled(false);
              }}
            />
            Yes
          </div>
          <div className="flex items-center gap-1">
            <input
              type="radio"
              name="charge"
              className="border-0  w-full scale-125 mr-1 accent-[#6741D9]"
              checked={disabled == true}
              onChange={(e) => {
                setDisabled(true);
              }}
            />
            <span>No</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between  w-[600px]">
        <div>Custom song request amount-</div>
        <input
          className="bg-transparent border  px-1 py-2 rounded-md text-white text-center disabled:bg-[#C2C2C2]"
          type="text"
          inputMode="numeric"
          pattern="[0-9]+"
          value={update?.category_6}
          disabled={disabled}
          name="category_6"
          onChange={updateCharges}
          data-min={99}
        />
      </div>
      <div className="flex justify-between  w-[600px] gap-8">
        <div>Regular song request amounts, from high to low</div>
        <div className="flex flex-wrap gap-2 w-56 justify-end ">
          <input
            className="bg-transparent border w-14  px-1 py-2 rounded-md text-white text-center disabled:bg-[#C2C2C2]"
            type="text"
            inputMode="numeric"
            value={update?.category_7}
            pattern="[0-9]+"
            data-min={dashboardData?.amount?.category_7}
            disabled={disabled}
            name="category_7"
            onChange={updateCharges}
          />
          <input
            className="bg-transparent border w-14 px-1 py-2 rounded-md text-white text-center disabled:bg-[#C2C2C2]"
            type="text"
            inputMode="numeric"
            value={update?.category_8}
            pattern="[0-9]+"
            data-min={dashboardData?.amount?.category_8}
            disabled={disabled}
            name="category_8"
            onChange={updateCharges}
          />
          <input
            className="bg-transparent border w-14 px-1 py-2 rounded-md text-white text-center disabled:bg-[#C2C2C2]"
            type="text"
            inputMode="numeric"
            value={update?.category_9}
            pattern="[0-9]+"
            data-min={dashboardData?.amount?.category_9}
            disabled={disabled}
            name="category_9"
            onChange={updateCharges}
          />
          <input
            className="bg-transparent border w-14  px-1 py-2 rounded-md text-white text-center disabled:bg-[#C2C2C2]"
            type="text"
            inputMode="numeric"
            value={update?.category_10}
            pattern="[0-9]+"
            data-min={dashboardData?.amount?.category_10}
            disabled={disabled}
            name="category_10"
            onChange={updateCharges}
          />
        </div>
      </div>
      {/* Bar chart comes here */}
      <div className="w-[600px]">
        {!disabled && <Barchart charges={flattenArrayCharges()} />}
      </div>

      <div className="w-[600px]">
        <button
          disabled={disabled || !areAllGoodValues()}
          className={`text-md font-bold bg-[#6741D9] w-full py-3 rounded-md disabled:bg-[#C2C2C2]`}
        >
          Save
        </button>
      </div>
    </form>
  );
}
