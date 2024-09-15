import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import Quagga from "quagga";
import { Box } from "@mui/material";
import Loading from "../Loading/Loading";

const PREFIX = "BarcodeScanner";

const classes = {
  box: `${PREFIX}-box`,
  loading: `${PREFIX}-loading`,
  modal: `${PREFIX}-modal`,
  closeButton: `${PREFIX}-closeButton`,
};

const Root = styled("div")({
  [`& .${classes.modal}`]: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "60%",
    backgroundColor: "white",
    boxShadow: "0px 0px 15px rgba(0,0,0,0.2)",
    zIndex: 1000,
    borderRadius: "8px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  [`& .${classes.box}`]: {
    display: "block",
    position: "relative",
    overflow: "hidden",
    "& video, & canvas": {
      maxWidth: "100%",
      width: "100%",
    },
    "& canvas.drawing, & canvas.drawingBuffer": {
      position: "absolute",
      left: "0",
      top: "0",
    },
  },
  [`& .${classes.loading}`]: {
    marginBottom: "32px",
  },
  [`& .${classes.closeButton}`]: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    padding: "5px 10px",
    fontSize: "16px",
  },
});

export function BarcodeScanner({ setCode, open, setOpen }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          constraints: {
            facingMode: "environment",
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
          target: document.querySelector("#barcode-scanner"),
        },
        locator: {
          halfSample: true,
          patchSize: "medium",
        },
        numOfWorkers: 2,
        decoder: {
          readers: [
            "code_39_reader",
            "code_128_reader",
            "ean_reader",
            "ean_8_reader",
            "upc_reader"
          ],
        },
        locate: true,
      },
      (err) => {
        if (err) {
          console.error("Quagga initialization error: ", err);
          return;
        }
        Quagga.start();
        setLoading(false);
      }
    );

    Quagga.onDetected((result) => {
      if (result.codeResult && result.codeResult.code) {
        Quagga.stop();
        setCode(result.codeResult.code);
        setOpen(false);
      }
    });

    return () => {
      Quagga.stop();
      Quagga.offDetected();
    };
  }, [open, setCode, setOpen]);

  return (
    <Root>
      <div className={classes.modal}>
        <button className={classes.closeButton} onClick={() => setOpen(false)}>X</button>
        <Box
          id="barcode-scanner"
          className={classes.box}
          visibility={loading ? "hidden" : "visible"}
        />
        {loading && <Loading className={classes.loading} />}
      </div>
    </Root>
  );
}

BarcodeScanner.propTypes = {
  setCode: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};
