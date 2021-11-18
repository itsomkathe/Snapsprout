export const initialState = null;

export const authReducer = (state, action)=>{
        switch(action.type){
                case "USER":
                        //console.log(action.payload);
                        //console.log(action);
                        return action.payload
                default:
                        return state;
        }
}