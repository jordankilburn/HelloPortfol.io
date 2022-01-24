import { useState } from "react";
import { useRecoilState } from "recoil";
import { Modal } from "react-responsive-modal";
import { toast } from "react-toastify";
import {
  showWhatState,
  basePortfolioAssetsState,
  historicalAssetsState,
} from "../recoil_states";
import toLocaleFixed from "../utils/toLocaleFixed";

const assetTypes = [
  {
    type: "Stock",
    shares: "Shares",
    ticker: "Ticker",
    tickerPlaceholder: "AAPL",
  },
  {
    type: "Crypto",
    shares: "Coins",
    ticker: "Ticker",
    tickerPlaceholder: "ETH",
  },
  {
    type: "NFT",
    shares: null,
    ticker: "Address",
    tickerPlaceholder: "0xd07dc4262BCDbf85190C01c996b4C06a461d2430",
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
    type: "Other",
    shares: null,
    ticker: "Name",
    tickerPlaceholder: "Jordan Rookie Card",
  },
];

export default () => {
  const [basePortfolioAssets, setBasePortfolioAssets] = useRecoilState(
    basePortfolioAssetsState
  );
  const [open, setOpen] = useState(false);
  const [inputs, setInputs] = useState({
    type: "Stock",
    shares: 1,
  });

  const handleChange = (e) =>
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
    if (!inputs.type || !chosenType) error = "Please include asset type.";
    if (!inputs.ticker) error = "Please include asset " + chosenType.ticker;
    if (chosenType.shares && !inputs.shares)
      error = "Please include asset " + chosenType.shares;
    if (chosenType.shares && inputs.shares <= 0)
      error = `Positive value for ${chosenType.shares}, please`;
    if (error !== "") return toast.error(error);

    // console.log(inputs);

    //add to portfolio

    //reset inputs
    // setInputs({});
  };

  return (
    <>
      <h2>Manage Assets</h2>
      <div className="row">
        <div className="item">
          {/* <p>Add/Remove assets from portfolio</p> */}
          <p>
            <button className="green-button" onClick={() => setOpen(true)}>
              Add Asset
            </button>
          </p>
        </div>
        <div className="item"></div>
      </div>
      <div className="row">
        <div className="item">
          <div className="table-wrapper">
            <table style={{ width: "100%" }}>
              <thead style={{ textAlign: "left" }}>
                <tr>
                  <th>Account</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Quantity</th>

                  <th></th>
                </tr>
              </thead>
              <tbody>
                {basePortfolioAssets.map((asset, i) => {
                  return (
                    <tr key={i}>
                      <td>{asset.account}</td>
                      <td>{asset.ticker}</td>
                      <td>{asset.type}</td>
                      <td>{toLocaleFixed(asset.shares, 3)}</td>
                      <td>
                        <button
                          className="red-button"
                          onClick={() => {
                            setBasePortfolioAssets(
                              basePortfolioAssets.filter(
                                (x) => x.ticker !== asset.ticker
                              )
                            );
                          }}
                        >
                          ✖
                        </button>{" "}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal
        open={!open}
        onClose={() => setOpen(false)}
        center
        closeOnEsc={false}
        closeOnOverlayClick={false}
        classNames={{
          // overlay: 'customOverlay',
          modal: "customModal",
        }}
      >
        <div>
          <h2>Add Asset</h2>
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
                {assetTypes.map((a) => (
                  <option key={a.type} value={a.type}>
                    {a.type}
                  </option>
                ))}
              </select>
            </div>
            {assetTypes.map((a) => {
              if (a.type !== inputs.type) return;
              if (!a.ticker) return;
              console.log(a);
              return (
                <div>
                  {a.ticker}
                  <input
                    name="ticker"
                    value={inputs.ticker || ""}
                    onChange={handleChange}
                    placeholder={a.tickerPlaceholder}
                  />
                </div>
              );
            })}
            {assetTypes.map((a) => {
              if (a.type !== inputs.type) return;
              if (!a.shares)
                return (
                  <div>
                    Value
                    <input
                      name="value"
                      value={inputs.value}
                      onChange={handleChange}
                      type="number"
                    />
                  </div>
                );
              return (
                <div>
                  {a.shares}
                  <input
                    name="shares"
                    value={inputs.shares}
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
      </Modal>
    </>
  );
};
