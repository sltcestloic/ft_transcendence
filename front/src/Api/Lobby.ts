import api from "./Api";

export async function fetchIsAlreadyInGame(): Promise<boolean> {
    let isInGame: boolean = false;
   await api.get(`/game/is-playing`)
    .then(response => {
        console.log("response", response.data);
        isInGame = response.data;
    })
    .catch(err => {
        console.log(err);
    })
    return isInGame;
}