import { createContext } from 'react';
// context variable - przechowuje informacja czy użytkownik jest zalogowany czy nie 
// Stworzyliśmy kontekst, aby potem zdefiniować jakie stany mogą być w nim użyte 
// musimy zdefiniować w komponencie o najwyższym poziomie tu App.js
export const AuthContext = createContext("");