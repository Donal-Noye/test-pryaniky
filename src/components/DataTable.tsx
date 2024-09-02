import { useEffect, useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	CircularProgress,
	IconButton,
	TextField,
	Typography,
} from '@mui/material';
import { fetchData, createRecord, updateRecord, deleteRecord } from '../services/api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {TableData, FetchDataBody} from '../types';

const DataTable = () => {
	const [data, setData] = useState<TableData[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [isAdding, setIsAdding] = useState<boolean>(false);
	const [newRecord, setNewRecord] = useState<Partial<FetchDataBody>>({});
	const [originalRecord, setOriginalRecord] = useState<TableData | null>(null);
	const [error, setError] = useState<string>('');

	useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			try {
				const response = await fetchData();
				setData(response.data);
			} catch (error: any) {
				setError('Ошибка загрузки данных: ' +  + error.response?.data?.title);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);

	const handleEdit = (id: string) => {
		const record = data.find((item) => item.id === id);
		if (record) {
			setOriginalRecord(record);
			setNewRecord({ ...record });
			setEditingId(id);
		}
	}

	const handleCreate = async () => {
		const currentDate = new Date().toISOString();
		const { ...recordToCreate } = {
			...newRecord,
			companySigDate: currentDate,
			employeeSigDate: currentDate,
		} as FetchDataBody;

		try {
			const response = await createRecord(recordToCreate);
			setData((prevData) => [...prevData, response.data]);
			setNewRecord({});
			setIsAdding(false);
		} catch (error: any) {
			setError('Ошибка создания записи: ' + error.response?.data?.title);
		}
	};


	const handleUpdate = async () => {
		if (!originalRecord) return;

		const updatedData = { ...originalRecord, ...newRecord };

		try {
			const response = await updateRecord(originalRecord.id, updatedData as FetchDataBody);
			setData((prevData) => prevData.map((item) => (item.id === originalRecord.id ? response.data : item)));
			setEditingId(null);
			setOriginalRecord(null);
		} catch (error: any) {
			setError('Ошибка обновления записи: ' + error.response?.data?.title);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteRecord(id);
			setData((prevData) => prevData.filter((item) => item.id !== id));
		} catch (error: any) {
			setError(error.response.data.title);
		}
	};

	const handleInputChange = (key: keyof FetchDataBody, value: string) => {
		setNewRecord({ ...newRecord, [key]: value });
	};

	const handleCancelEdit = () => {
		setNewRecord({});
		setEditingId(null);
		setOriginalRecord(null);
	};

	const handleCancelAdd = () => {
		setNewRecord({});
		setIsAdding(false);
	};
	console.log(data)
	if (loading) return <div className="loading"><CircularProgress /></div>;

	const columns: (keyof FetchDataBody)[] = [
		'companySigDate',
		'companySignatureName',
		'documentName',
		'documentStatus',
		'documentType',
		'employeeNumber',
		'employeeSigDate',
		'employeeSignatureName',
	];

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('ru-RU', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	return (
		<TableContainer component={Paper}>
			{error && (
				<Typography align="center" color="error" variant="body1"  gutterBottom>
					{error}
				</Typography>
			)}
			<Table>
				<TableHead>
					<TableRow>
						{columns.map((column) => (
							<TableCell key={column}>
								{column
									.replace(/([A-Z])/g, ' $1')
									.replace(/^./, (str) => str.toUpperCase())}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{data.map((row) => (
						<TableRow key={row.id}>
							{columns.map((key) => (
								<TableCell key={key}>
									{editingId === row.id ? (
										<TextField
											value={newRecord[key] ?? row[key] ?? ''}
											onChange={(e) => handleInputChange(key, e.target.value)}
										/>
									) : key === 'companySigDate' || key === 'employeeSigDate' ? (
										formatDate(row[key as keyof TableData] as string)
									) : (
										row[key as keyof TableData] ?? ''
									)}
								</TableCell>
							))}
							<TableCell>
								{editingId === row.id ? (
									<>
										<Button onClick={handleUpdate}>Сохранить</Button>
										<Button onClick={handleCancelEdit}>Отмена</Button>
									</>
								) : (
									<>
										<IconButton onClick={() => handleEdit(row.id)}>
											<EditIcon />
										</IconButton>
										<IconButton onClick={() => handleDelete(row.id)}>
											<DeleteIcon />
										</IconButton>
									</>
								)}
							</TableCell>
						</TableRow>
					))}

					{isAdding && (
						<TableRow>
							{columns.map((key) => (
								<TableCell key={key}>
									<TextField
										value={newRecord[key] ?? ''}
										onChange={(e) => handleInputChange(key, e.target.value)}
									/>
								</TableCell>
							))}
							<TableCell>
								<Button onClick={handleCreate}>Сохранить</Button>
								<Button onClick={handleCancelAdd}>Отмена</Button>
							</TableCell>
						</TableRow>
					)}

					{!isAdding && (
						<TableRow>
							<TableCell colSpan={columns.length + 1}>
								<Button onClick={() => setIsAdding(true)}>Добавить запись</Button>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default DataTable;
