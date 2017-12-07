import Reflux from "reflux";
import Immutable from "immutable";

import actions from "appcontext/actions";

let Store = Reflux.createStore({
    listenables: [actions],
    getInitialState:function(){
        //console.log("in store")
        return Immutable.Map({});
    },
    onNotify:function(lens, state){
        this.trigger({lens, state});
        actions.notify.completed(state);
    }
});
export default Store;