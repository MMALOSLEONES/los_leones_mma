// import { NextResponse } from "next/server";

// const API_URL = process.env.API_URL;

// export async function POST(request: Request) {
//   try {
//     if (!API_URL) {
//       return NextResponse.json(
//         { message: "URL du backend non configurée." },
//         { status: 500 },
//       );
//     }

//     const body = await request.json();

//     const laravelResponse = await fetch(
//       `${API_URL.replace(/\/$/, "")}/payments/initiate`,
//       {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//         cache: "no-store",
//       },
//     );

//     const result = await laravelResponse.json().catch(() => ({}));

//     console.log("Statut Laravel :", laravelResponse.status);
//     console.log("Réponse Laravel :", result);

//     return NextResponse.json(result, {
//       status: laravelResponse.status,
//     });
//   } catch (error) {
//     console.error("Erreur initialisation paiement :", error);

//     return NextResponse.json(
//       { message: "Impossible de contacter le serveur de paiement." },
//       { status: 502 },
//     );
//   }
// }
