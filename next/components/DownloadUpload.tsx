import { useState } from "react";
import Modal from "../components/Modal";
import { ExportToCsv } from "export-to-csv";
import Papa from "papaparse";
import currency from "currency.js";
import { exampleData } from "../utils/examplePortfolios";
import { AssetType, BasePortfolioAsset } from "../types";
import { SetterOrUpdater } from "recoil";
import Share from "./Share";

const options = {
  fieldSeparator: ",",
  quoteStrings: '"',
  decimalSeparator: ".",
  showLabels: true,
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: true,
  filename: "Portfolio",
};
type TCSVInput = {
  "Asset Type": string;
  Value: number;
  "Ticker / Address / Name": string;
  "Quantity / Shares": number;
  Nickname: string;
};

type Props = {
  basePortfolioAssets: BasePortfolioAsset[];
  assetTypes: AssetType[];
  setBasePortfolioAssets: SetterOrUpdater<any>;
};
export default function CsvReader({
  basePortfolioAssets,
  assetTypes,
  setBasePortfolioAssets,
}: Props) {
  const [open, setOpen] = useState(false);
  const [openErase, setOpenErase] = useState(false);
  const csvExporter = new ExportToCsv(options);

  // [{name: "", age: 0, rank: ""},{name: "", age: 0, rank: ""}]

  const addAssets = (assets: TCSVInput[]) => {
    let totalCount = basePortfolioAssets.length;
    let newAssets = [];
    const keys = Object.keys(assets[0]);
    for (let i = 0; i < assets.length; i++) {
      // if (totalCount >= 20)
      //   return toast.error("You can only track up to 20 items right now.");
      const asset = assets[i];
      const type = asset["Asset Type"];
      if (!type) continue;
      const chosenType = assetTypes.find((a) => type.includes(a.type));
      if (chosenType) {
        //if a valid type
        let thisValue = currency(asset["Value"]).value;
        let thisTicker = asset["Ticker / Address / Name"];
        if (chosenType.type === "Liability")
          thisValue = -1 * Math.abs(thisValue);
        if (chosenType.type === "Stock")
          thisTicker.replace(/[^A-Za-z0-9-]/g, "");

        newAssets.push({
          ...{
            account: "Default Account",
            type: type,
            ticker: thisTicker,
            shares: currency(asset["Quantity / Shares"]),
            value: thisValue,
            show: true,
          },
          ...(asset["Nickname"] && { nickname: asset["Nickname"] }),
        });
      }
      totalCount++;
    }
    setBasePortfolioAssets([...basePortfolioAssets, ...newAssets]);
    setOpen(false);
  };

  const submit = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: function (results) {
          addAssets(results.data as TCSVInput[]);
        },
      });
    }
  };

  const downloadCSV = () => {
    csvExporter.generateCsv(
      basePortfolioAssets.map(({ ticker, shares, nickname, type, value }) => {
        return {
          "Asset Type": "NFT",
          "Ticker / Address / Name": ticker,
          "Quantity / Shares": shares,
          Value: value ? value : "",
          Nickname: nickname ? nickname : "",
        };
      })
    );
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>Upload</button>
      <button onClick={downloadCSV}>Download</button>
      <Share basePortfolioAssets={basePortfolioAssets}/>

      <button className="red-button" onClick={() => setOpenErase(true)}>
        Erase Portfolio
      </button>
      {open && (
        <Modal
          customClass={""}
          headline={"Upload CSV"}
          body={
            <>
              You can upload all your assets/liabilities in a single file!
              <br />
              <br />
              You need to upload a csv with 5 columns (Exact header must be
              used):
              <div style={{ margin: "1rem 0" }}>
                1. <b>Asset Type</b>: Valid Asset Types (as of now) are:
                <br />{" "}
                {assetTypes.map((e) => {
                  return `"${e.type}", `;
                })}
                <br />
                <br />
                2. <b>Ticker / Address / Name</b>: This is the stock/crypto
                ticker, the address/token for an NFT, or custom name or address
                for everything else.
                <br />
                <br />
                3. <b>Quantity / Shares</b>
                <br />
                <br />
                4. <b>Value (optional)</b>: Value is not needed for assets of
                type Stock, Crypto, or NFT as they are tracked. Liabilities are
                always made negative automatically.
                <br />
                <br />
                5. <b>Nickname (optional)</b>: Only used for NFTs.
              </div>
              <br />
              <br />
              <label htmlFor="csvFile" className="file-upload green-button">
                Choose CSV
              </label>
              <input
                style={{ display: "none" }}
                className="upload-button"
                type="file"
                accept=".csv"
                id="csvFile"
                onChange={submit}
              />
              <button onClick={() => csvExporter.generateCsv(exampleData)}>
                Download an Example
              </button>
            </>
          }
          open={open}
          setOpen={setOpen}
        />
      )}
      {openErase && (
        <Modal
          customClass={""}
          headline={"Are you sure you want to erase all your portfolio?"}
          body={
            <div>
              <p>At least download it first!</p>
              <button onClick={downloadCSV}>Download as CSV</button>
              <div className="add-asset-form">
                <button
                  style={{ marginTop: 20, width: "100%" }}
                  className="red-button"
                  onClick={() => {
                    setBasePortfolioAssets([]);
                    setOpenErase(false);
                  }}
                >
                  Do it! Erase EVERYTHING!
                </button>
              </div>
            </div>
          }
          open={openErase}
          setOpen={setOpenErase}
        />
      )}
    </>
  );
}
