import fs from 'fs';
import path from 'path';
import PortfolioCMS from '../components/PortfolioCMS';

export default function Home({ initialData }) {
  return <PortfolioCMS initialData={initialData} />;
}

// Loads the initial storage definitions from your laptop's data folder on runtime
export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'data', 'database.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const initialData = JSON.parse(fileContents);

  return {
    props: {
      initialData,
    },
  };
}