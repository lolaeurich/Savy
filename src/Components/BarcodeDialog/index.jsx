import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog as DialogMui,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  SvgIcon,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { IoIosClose } from "react-icons/io";
import { BarcodeScanner } from "./BarcodeScanner";
import axios from "axios";

export function BarcodeDialog({ open, setOpen, setCode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [productName, setProductName] = useState(""); // Novo estado para armazenar o nome do produto

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (setCode) {
      // Faça a requisição à API sempre que o código for definido
      const fetchProductData = async () => {
        try {
          const response = await axios.get(
            `https://menorpreco.notaparana.pr.gov.br/api/v1/produtos`,
            {
              params: {
                local: "-25.54692,-49.18058", // Você pode ajustar isso conforme necessário
                termo: setCode, // O código de barras lido
                raio: "20",
              },
            }
          );

          if (response.data && response.data.produtos && response.data.produtos.length > 0) {
            // Supondo que a resposta contenha uma lista de produtos
            setProductName(response.data.produtos[0].nome); // Pegue o nome do primeiro produto
          } else {
            setProductName("Produto não encontrado.");
          }
        } catch (error) {
          console.error("Erro ao buscar o produto:", error);
          setProductName("Erro ao buscar o produto.");
        }
      };

      fetchProductData();
    }
  }, [setCode]);

  return (
    <DialogMui
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth={"md"}
    >
      <DialogTitle id="alert-dialog-title">
        <Grid
          container
          justifyContent="space-between"
          direction="row"
          alignItems="center"
          wrap="nowrap"
        >
          <Grid item>
            <Typography>Leitor de Código de Barras</Typography>
          </Grid>
          <Grid item>
            <IconButton onClick={handleClose}>
              <SvgIcon>
                <IoIosClose />
              </SvgIcon>
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>

      <DialogContent>
        {isMobile && window.location.protocol !== "https:" ? (
          <DialogContentText id="alert-dialog-description">
            Essa funcionalidade requer https
          </DialogContentText>
        ) : (
          <>
            <BarcodeScanner setCode={setCode} open={open} setOpen={setOpen} />
            {productName && (
              <Typography>
                Nome do Produto: {productName}
              </Typography>
            )}
          </>
        )}
      </DialogContent>
    </DialogMui>
  );
}

BarcodeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  setCode: PropTypes.func.isRequired,
};
