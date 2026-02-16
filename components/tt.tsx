'use client';

export default function ListaUsuarios() {

  const datos = {
    category: "1",
    name: "Chatgpt",
    link: "chatgpt.com",
    icon: ""
  }

  const obtenerUsuarios = async () => {
    const res = await fetch('/api/bookmark', {
      method: "POST",
     headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    }); // Ruta relativa
    const data = await res.json();
    console.log(data);
  };

  return <button className="text-white" onClick={obtenerUsuarios}>Cargar Usuarios</button>;
}
