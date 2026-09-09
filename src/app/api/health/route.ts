import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Exécution de la requête SQL
        const result = await pool.query("SELECT NOW() as heure_actuelle");
        
        // Retour de la réponse en cas de succès
        return NextResponse.json({ 
            status: "ok", 
            heure_actuelle: result.rows[0].heure_actuelle 
        });
    } catch (error) {
        // Log de l'erreur dans la console du serveur pour le débogage
        console.error("Erreur lors de la récupération de l'heure :", error);

        // Retour d'une réponse d'erreur HTTP 500 au client
        return NextResponse.json(
            { 
                status: "error", 
                message: "Une erreur interne est survenue." 
            }, 
            { status: 500 }
        );
    }
}
