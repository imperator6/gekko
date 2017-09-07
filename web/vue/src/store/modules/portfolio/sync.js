import { get } from '../../../tools/ajax'
import store from '../../'
import { bus } from '../../../components/global/ws'




const init = () => {
  get('portfolios', (err, resp) => {
    store.commit('syncPortfolioList', resp);
  });

}


export default function() {
  init();

}