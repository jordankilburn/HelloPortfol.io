import { useState } from "react";
import { useRecoilState } from "recoil";
import Modal from "../components/Modal";
import { toast } from "react-toastify";
import {
  basePortfolioAssetsState,
  sortedByState,
} from "../utils/recoil_states";
import toLocaleFixed from "../utils/toLocaleFixed";
import supportedCryptos from "../utils/supportedCryptos";
import DownloadUpload from "../components/DownloadUpload";
import currency from "currency.js";
import { AssetType, BasePortfolioAsset } from "../types";

const assetTypes: AssetType[] = [
  {
    type: "Stock",
    shares: "Shares",
    ticker: "Ticker",
    tickerPlaceholder: "AAPL",
    value: "tracked",
  },
  {
    type: "Crypto",
    shares: "Coins",
    ticker: "Ticker",
    tickerPlaceholder: "ETH",
    value: "tracked",
  },
  {
    type: "NFT",
    shares: null,
    nickname: "Nickname",
    ticker: "Address/Token",
    tickerPlaceholder: "0xd07...430/3423",
    value: "tracked",
  },
  {
    type: "Real Estate",
    shares: null,
    ticker: "Address",
    tickerPlaceholder: "1 Hacker Way, Menlo Park, CA 94025",
  },
  {
    type: "Private Business",
    shares: null,
    ticker: "Business Name",
    tickerPlaceholder: "Meta Inc",
  },
  {
    type: "Other Asset",
    shares: null,
    ticker: "Name",
    tickerPlaceholder: "Jordan Rookie Card",
  },
  {
    type: "Liability",
    shares: null,
    ticker: "Name",
    tickerPlaceholder: "Home Loan",
  },
];

const defaultInputState = {
  type: "Crypto",
  shares: 1,
  ticker: "",
  nickname: "",
  value: 0,
};

export default function Manage() {
  const [basePortfolioAssets, setBasePortfolioAssets] = useRecoilState(
    basePortfolioAssetsState
  );

  const [sortedBy, setSortedBy] = useRecoilState(sortedByState);

  const [open, setOpen] = useState(false);
  const [openRemove, setOpenRemove] = useState<BasePortfolioAsset | null>(null);
  const [inputs, setInputs] = useState(defaultInputState);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) =>
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

  const handleAddAsset = () => {
    let error = "";
    toast.clearWaitingQueue();
    toast.dismiss();

    const chosenType = assetTypes.find((a) => a.type === inputs.type);

    // if (!inputs.account) error = "Please include account name.";

    if (!inputs.type || !chosenType) error = "Please choose asset type.";
    else if (!inputs.ticker)
      error = `Please include ${inputs.type} ${chosenType.ticker}`;
    else if (chosenType.shares && !inputs.shares)
      error = "Please include asset " + chosenType.shares;
    else if (chosenType.shares && inputs.shares <= 0)
      error = `Positive value for ${chosenType.shares}, please`;
    else if (chosenType.nickname && !inputs.nickname)
      error = `Choose a ${chosenType.nickname}, please`;
    else if (chosenType.value !== "tracked" && !inputs.value)
      error = `Place a value on your ${chosenType.type}, please`;
    if (inputs.type === "Crypto") {
      if (
        !supportedCryptos.find(
          (x) => x.symbol.toLowerCase() === inputs.ticker.toLowerCase()
        )
      )
        error = `Cannot find ${inputs.ticker}.`;
    }
    let thisValue = currency(inputs.value).value;
    if (chosenType && chosenType.type === "Liability")
      thisValue = -1 * Math.abs(thisValue);

    if (error !== "") return toast.error(error);

    //add to portfolio
    setBasePortfolioAssets([
      {
        account: "Default Account",
        type: inputs.type,
        ticker: inputs.ticker,
        shares: inputs.shares || 1,
        nickname: inputs.nickname,
        value: thisValue,
        show: true,
      },
      ...basePortfolioAssets,
    ]);

    //reset inputs
    setInputs(defaultInputState);
    setOpen(false);
    return toast.success(`Added ${inputs.ticker}!`);
  };

  const sortBy = (sortType: string) => {
    const newSort: BasePortfolioAsset[] = JSON.parse(
      JSON.stringify(basePortfolioAssets)
    );
    switch (sortType) {
      case "Value":
        sortedBy === "asc"
          ? newSort.sort((a, b) => b.value - a.value)
          : newSort.sort((a, b) => a.value - b.value);
        break;
      case "Ticker":
        sortedBy === "asc"
          ? newSort.sort((a, b) => a.ticker.localeCompare(b.ticker))
          : newSort.sort((a, b) => b.ticker.localeCompare(a.ticker));
        break;
      case "Shares":
        sortedBy === "asc"
          ? newSort.sort((a, b) => b.shares - a.shares)
          : newSort.sort((a, b) => a.shares - b.shares);
        break;
      // case "ROI":
      //   sortedBy === "asc"
      //     ? newSort.sort((a, b) => b.roi - a.roi)
      //     : newSort.sort((a, b) => a.roi - b.roi);
      //   break;
      case "Type":
        sortedBy === "asc"
          ? newSort.sort((a, b) => a.type.localeCompare(b.type))
          : newSort.sort((a, b) => b.type.localeCompare(a.type));
        break;

      default:
        return;
    }
    setSortedBy(sortedBy === "asc" ? "desc" : "asc");
    setBasePortfolioAssets(newSort);
  };

  return (
    <>
      <div className="row">
        <div className="item">
          <h2>Manage Assets/Liabilities</h2>
          {/* <p>Add/Remove assets from portfolio</p> */}
          {/* {basePortfolioAssets.length < 20 ? ( */}
          <div className="flex-buttons">
            <button className="green-button" onClick={() => setOpen(true)}>
              Add Asset
            </button>
            <DownloadUpload
              assetTypes={assetTypes}
              basePortfolioAssets={basePortfolioAssets}
              setBasePortfolioAssets={setBasePortfolioAssets}
            />
          </div>
          {/* ) : (
            <p>You can only track up to 20 items (for now...)</p>
          )} */}
          {basePortfolioAssets.length > 0 && (
            <div
              className="table-wrapper"
              style={{
                maxHeight: "100%",
                overflow: "auto",
                marginBottom: "3rem",
                marginTop: "1rem",
              }}
            >
              <table style={{ width: "100%" }}>
                <thead style={{ textAlign: "left" }}>
                  <tr>
                    <th></th>
                    {/* <th>Account</th> */}
                    <th>Item</th>
                    <th onClick={() => sortBy("Type")}>Type</th>
                    <th onClick={() => sortBy("Shares")}>QTY</th>
                    <th onClick={() => sortBy("Value")}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {basePortfolioAssets.map(
                    (asset: BasePortfolioAsset, i: number) => {
                      return (
                        <tr key={i}>
                          <td>
                            <button
                              className="x-button"
                              onClick={() => {
                                setOpenRemove(asset);
                              }}
                            >
                              ✖
                            </button>{" "}
                          </td>
                          {/* <td>{asset.account}</td> */}
                          <td>{asset.nickname || asset.ticker}</td>
                          <td>{asset.type}</td>
                          <td>
                            {toLocaleFixed(
                              asset.shares,
                              asset.shares >= 1 ? 0 : 2
                            )}
                          </td>
                          <td className={asset.value < 0 ? "red" : "green"}>
                            ${toLocaleFixed(asset.value)}
                          </td>
                        </tr>
                      );
                    }
                  )}
                  <tr>
                    <td></td>
                    <td>
                      {" "}
                      <b className="green">Total:</b>
                    </td>
                    <td></td>
                    <td></td>
                    <td>
                      <b className="green">
                        $
                        {toLocaleFixed(
                          basePortfolioAssets.reduce(
                            (a: number, b: BasePortfolioAsset) =>
                              a + (b.value || 0),
                            0
                          )
                        )}
                      </b>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Modal
        open={open}
        body={
          <div>
            <div className="add-asset-form">
              {/* <div>
              Account Name
              <input
                name="account"
                value={inputs.account || ""}
                onChange={handleChange}
                placeholder="Robinhood"
              />
            </div> */}
              <div>
                Asset Type
                <select name="type" onChange={handleChange} value={inputs.type}>
                  <option value={""}></option>
                  {assetTypes.map((a) => (
                    <option key={a.type} value={a.type}>
                      {a.type}
                    </option>
                  ))}
                </select>
              </div>
              {assetTypes.map((a) => {
                if (a.type !== inputs.type) return null;
                if (!a.ticker) return null;

                return (
                  <div key={a.ticker}>
                    {a.ticker}
                    <span style={{ display: "flex" }}>
                      <input
                        name="ticker"
                        value={inputs.ticker || ""}
                        onChange={handleChange}
                        placeholder={a.tickerPlaceholder}
                        autoComplete="off"
                      />
                      {/* <button className="search">🔍</button> */}
                    </span>
                  </div>
                );
              })}
              {assetTypes.map((a) => {
                if (a.type !== inputs.type) return null;
                if (a.nickname)
                  return (
                    <div key={a.ticker}>
                      Nickname
                      <input
                        name="nickname"
                        value={inputs.nickname || ""}
                        onChange={handleChange}
                      />
                    </div>
                  );
                if (!a.shares)
                  return (
                    <div key={a.ticker}>
                      Value
                      <input
                        name="value"
                        value={inputs.value || 1}
                        onChange={handleChange}
                        type="number"
                      />
                    </div>
                  );

                return (
                  <div key={a.ticker}>
                    {a.shares}
                    <input
                      name="shares"
                      value={inputs.shares || 1}
                      onChange={handleChange}
                      type="number"
                    />
                  </div>
                );
              })}
            </div>
            <button
              style={{ marginTop: 20, width: "100%" }}
              className="green-button"
              onClick={handleAddAsset}
            >
              Add to Portfolio
            </button>
          </div>
        }
        headline={"Add Asset"}
        setOpen={setOpen}
        customClass={""}
      />
      {openRemove !== null && (
        <Modal
          open={openRemove ? true : false}
          body={
            <div>
              <div className="add-asset-form">
                <button
                  style={{ marginTop: 20, width: "100%" }}
                  className="red-button"
                  onClick={() => {
                    setBasePortfolioAssets(
                      basePortfolioAssets.filter(
                        (x: BasePortfolioAsset) =>
                          x.ticker !== openRemove.ticker
                      )
                    );
                    setOpenRemove(null);
                  }}
                >
                  Yes, remove {openRemove.nickname || openRemove.ticker} from my
                  portfolio!
                </button>
              </div>
            </div>
          }
          headline={`Remove ${openRemove.nickname || openRemove.ticker}?`}
          setOpen={setOpenRemove}
          customClass={""}
        />
      )}
    </>
  );
}
