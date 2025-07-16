import { Card, Typography, Button } from "antd";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="space-y-6">
      <Typography.Title>Agente de Migración Angular</Typography.Title>
      <Typography.Paragraph>
        Este asistente te ayudará a actualizar proyectos antiguos de Angular
        (como Angular 2) hasta la versión más reciente, de forma segura y
        automatizada.
      </Typography.Paragraph>

      <Card title="¿Cómo funciona?" bordered={false}>
        <ol className="list-decimal pl-6 space-y-1">
          <li>Sube tu proyecto (formato .zip o repositorio GitHub)</li>
          <li>El agente lo analizará y generará un plan de actualización</li>
          <li>Se ejecutará el proceso paso a paso (puedes pausarlo)</li>
          <li>Podrás descargar el proyecto actualizado</li>
        </ol>
      </Card>

      <Link to="/upload">
        <Button type="primary" size="large">
          Comenzar migración
        </Button>
      </Link>
    </div>
  );
}
