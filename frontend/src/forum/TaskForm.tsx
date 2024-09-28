import React from 'react';
import { TextField, Button, Container, Grid, Typography, Paper } from '@mui/material';
import { useTaskStore } from '../stores/TaskStore'; // Zustand Store'u içe aktarıyoruz

const TaskForm: React.FC = () => {
  const { taskData, setTaskData, submitTask } = useTaskStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTaskData({ [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitTask();
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" gutterBottom align="center">
          Görev Ekle
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="TaskName"
                label="Görev Adı"
                fullWidth
                required
                value={taskData.TaskName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="TaskDescription"
                label="Görev Açıklaması"
                fullWidth
                multiline
                rows={4}
                required
                value={taskData.TaskDescription}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="TaskStartDate"
                label="Başlangıç Tarihi"
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                required
                value={taskData.TaskStartDate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="TaskEndDate"
                label="Bitiş Tarihi"
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                required
                value={taskData.TaskEndDate}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Görev Ekle
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default TaskForm;
