import { Container, Typography } from '@mui/material';
import DataTable from '../components/DataTable';

const Home = () => {
	return (
		<Container>
			<Typography variant="h4" component="h1" gutterBottom align="center">
				Таблица данных
			</Typography>
			<DataTable />
		</Container>
	);
};

export default Home;