require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const url = "https://www.worldometers.info/coronavirus/"
const app = express();

app.use(cors());

app.get('/dados', (req, res) => {
    procuraDados()
        .then(resp => {
            console.log(resp);
            res.json(resp);
        })
        .catch(err => { console.log(err); });
});

const procuraDados = async () => {
    try {
        const response = await axios.default.get(url);
        const linhas = retornaLinhas(response.data);
        return linhas;
    } catch (error) {
        return error;
    }
}

const retornaLinhas = (html) => {
    const $ = cheerio.load(html);
    return $('tbody tr').map((index, element) => {
        let linhaMortes = $(element).find('td').eq(6).text().trim();
        if (linhaMortes === '') {
            return {
                pais: $(element).find('td').first().text().trim(),
                casosAtivos: 0
            }
        } else {
            var regex = new RegExp(',', 'g');
            linhaMortes = linhaMortes.replace(regex, '');
            return {
                pais: $(element).find('td').first().text().trim(),
                casosAtivos: Number(linhaMortes)
            }
        }
    }).get();
}

app.get('/casos', (req, res) => {
    procuraCasos()
        .then(resp => {
            console.log(resp)
            res.json(resp);
        }).catch(err => {
            console.log(err);
        })
});

const procuraCasos = async () => {
    try {
        const response = await axios.default.get(url);
        const valor = retornaValor(response.data);
        return { numeroCasos: valor };
    } catch (error) {
        return error;
    }
}

const retornaValor = (html) => {
    const $ = cheerio.load(html);
    return $('.maincounter-number').eq(0).find('span').text();
}

app.listen(process.env.PORT, () => {
    console.log('Server rodando');
})