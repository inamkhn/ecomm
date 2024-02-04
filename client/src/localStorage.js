export const addUserToLocalStorage = (user)=>{
    localStorage.setItem('user',JSON.stringify(user))
 }
 
 export const RemoveUserFromLocalStorage = ()=>{
     localStorage.removeItem('user')
  }
 
 export const GetUserFromLocalStorage = ()=>{
     let user =  localStorage.getItem('user')
    //  let user = res ? JSON.parse(res):null
     return user
  }