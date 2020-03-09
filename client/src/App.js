import React from 'react';
import axios from 'axios';
import { Chart } from "react-google-charts";
const api = axios.create({ baseURL: 'http://localhost:9000' });
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { dados: [['País', 'Casos ativos']], numeroCasos: 'Carregando...' };
  }
  componentDidMount() {
    api.get('dados')
      .then(res => {
        const arrayLinhas = [['País', 'Casos ativos']]
        res.data.forEach(value => {
          arrayLinhas.push([value.pais, value.casosAtivos])
        });
        this.setState({ dados: arrayLinhas });
        console.log(this.state.dados)
      }).catch(err => {
        console.log(err);
      });

    api.get('casos')
      .then(res => {
        console.log(res.data.numeroCasos)
        this.setState({ numeroCasos: res.data.numeroCasos });
      }).catch(err => {
        console.log(err);
      });

  }

  render() {
    return (
      <div>
        <div>
          <h1 className='text-white'>Casos de coronavírus: {this.state.numeroCasos}</h1>
        </div>
        <div>
          <Chart
            width={'100%'}
            height={'400px'}
            chartType="GeoChart"
            options={{
              colorAxis: { colors: ['#ed7b72', '#8c190f'] },
              backgroundColor: '#81d4fa',
            }}
            data={this.state.dados}
            
            rootProps={{ 'data-testid': '1' }}
          />
        </div>
      </div>
    );
  }
}
export default App;

