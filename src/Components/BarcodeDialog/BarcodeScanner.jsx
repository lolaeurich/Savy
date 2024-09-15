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
};

const Root = styled("div")({
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
            width: 640,
            height: 480,
            facingMode: "environment",
          },
          target: document.querySelector("#barcode-scanner"),
        },
        locator: {
          halfSample: true,
          patchSize: "large",
        },
        numOfWorkers: navigator.hardwareConcurrency || 2,
        decoder: {
          readers: ["code_39_reader", "code_128_reader", "ean_reader"],
        },
        locate: true,
        multiple: false,
        frequency: 10,
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
      <Box
        id="barcode-scanner"
        className={classes.box}
        visibility={loading ? "hidden" : "visible"}
      />
      {loading && <Loading className={classes.loading} />}
    </Root>
  );
}

BarcodeScanner.propTypes = {
  setCode: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};
