import React, { useEffect, useState } from "react";
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
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (open && setCode) {
      setProductData(null); // Limpar dados do produto ao abrir o diálogo
      setError(null); // Limpar erros ao abrir o diálogo
    }
  }, [open, setCode]);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!setCode) return; // Se não há código, não fazer a requisição

      try {
        // Verifica se o código contém apenas números (GTIN) ou não (nome)
        const isGtin = /^\d+$/.test(setCode);
        const url = "https://savvy-api.belogic.com.br/api/shopping/find";
        const params = isGtin ? { gtin: setCode } : { nome: setCode };

        const response = await axios.get(url, { params });

        // Encontrar o produto com o código de barras (se disponível)
        if (response.data.data && response.data.data.length > 0) {
          const product = response.data.data.find(p => p.gtin === setCode);
          if (product) {
            setProductData(product);
            setError(null);
          } else {
            setProductData(null);
            setError("Produto não encontrado.");
          }
        } else {
          setProductData(null);
          setError("Produto não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar o produto:", error);
        setProductData(null);
        setError("Erro ao buscar o produto.");
      }
    };

    fetchProductData();
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
            {productData ? (
              <div>
                <Typography variant="h6">Nome do Produto: {productData.desc}</Typography>
                <Typography>Valor: R$ {productData.valor}</Typography>
                <Typography>Data e Hora: {new Date(productData.datahora).toLocaleString()}</Typography>
                <Typography>Distância: {productData.distkm} km</Typography>
                <Typography>Estabelecimento: {productData.estabelecimento.nm_emp}</Typography>
                <Typography>Endereço: {productData.estabelecimento.nm_logr}, {productData.estabelecimento.nr_logr}, {productData.estabelecimento.bairro}</Typography>
              </div>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <Typography>Aguardando leitura do código de barras...</Typography>
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
