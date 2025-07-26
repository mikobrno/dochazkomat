import React, { useState, useMemo } from 'react';
import { Clock, Edit2, Trash2, Calendar, Save, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getTimeEntries, getProjects, deleteTimeEntry, updateTimeEntry, calculateHoursFromTime } from '../../utils/supabaseStorage';
import { format } from 'date-fns';

export const TimeHistory: React.FC = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [timeEntries, setTimeEntries] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editFormData, setEditFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    hoursWorked: 0,
    projectId: '',
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [entriesData, projectsData] = await Promise.all([
          getTimeEntries(),
          getProjects()
        ]);
        setTimeEntries(entriesData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  const filteredEntries = useMemo(() => {
    if (!user) return [];
    
    return timeEntries
      .filter(entry => {
        const entryDate = format(new Date(entry.date), 'yyyy-MM');
        return entry.userId === user.id && entryDate === selectedMonth;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [timeEntries, user, selectedMonth]);

  const totalHours = filteredEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0);

  const calculateHours = (start: string, end: string): number => {
    const startTime = new Date(`2000-01-01T${start}:00`);
    const endTime = new Date(`2000-01-01T${end}:00`);
    const diffMs = endTime.getTime() - startTime.getTime();
    return Math.max(0, diffMs / (1000 * 60 * 60));
  };

  const handleEdit = (entry: any) => {
    setEditingEntry(entry.id);
    setEditFormData({
      date: entry.date,
      startTime: entry.startTime,
      endTime: entry.endTime,
      hoursWorked: entry.hoursWorked,
      projectId: entry.projectId,
      description: entry.description || ''
    });
    setErrors({});
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    const newFormData = { ...editFormData, [field]: value };
    
    if (newFormData.startTime && newFormData.endTime) {
      const calculatedHours = calculateHours(newFormData.startTime, newFormData.endTime);
      newFormData.hoursWorked = Math.round(calculatedHours * 100) / 100;
    }
    
    setEditFormData(newFormData);
  };

  const validateEditForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!editFormData.date) {
      newErrors.date = 'Datum je povinné';
    }

    if (!editFormData.startTime) {
      newErrors.startTime = 'Čas začátku je povinný';
    }

    if (!editFormData.endTime) {
      newErrors.endTime = 'Čas konce je povinný';
    }

    if (editFormData.startTime && editFormData.endTime) {
      const hours = calculateHours(editFormData.startTime, editFormData.endTime);
      if (hours <= 0) {
        newErrors.endTime = 'Čas konce musí být po času začátku';
      } else if (hours > 24) {
        newErrors.endTime = 'Pracovní doba nemůže být delší než 24 hodin';
      }
    }

    if (!editFormData.projectId) {
      newErrors.projectId = 'Projekt je povinný';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEdit = async () => {
    if (!validateEditForm() || !editingEntry) return;

    try {
      await updateTimeEntry(editingEntry, {
        date: editFormData.date,
        startTime: editFormData.startTime,
        endTime: editFormData.endTime,
        hoursWorked: editFormData.hoursWorked,
        projectId: editFormData.projectId,
        description: editFormData.description.trim() || undefined
      });

      setEditingEntry(null);
      // Refresh data after successful update
      const [entriesData, projectsData] = await Promise.all([
        getTimeEntries(),
        getProjects()
      ]);
      setTimeEntries(entriesData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error updating time entry:', error);
      alert('Nepodařilo se aktualizovat záznam. Zkuste to znovu.');
    }
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
    setEditFormData({
      date: '',
      startTime: '',
      endTime: '',
      hoursWorked: 0,
      projectId: '',
      description: ''
    });
    setErrors({});
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Opravdu chcete smazat tento záznam?')) {
      try {
        const success = await deleteTimeEntry(id);
        if (success) {
          // Refresh data after successful deletion
          const [entriesData, projectsData] = await Promise.all([
            getTimeEntries(),
            getProjects()
          ]);
          setTimeEntries(entriesData);
          setProjects(projectsData);
        }
      } catch (error) {
        console.error('Error deleting time entry:', error);
        alert('Nepodařilo se smazat záznam. Zkuste to znovu.');
      }
    }
  };
        // Refresh data after successful deletion
        const [entriesData, projectsData] = await Promise.all([
          getTimeEntries(),
          getProjects()
        ]);
        setTimeEntries(entriesData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error deleting time entry:', error);
        alert('Nepodařilo se smazat záznam. Zkuste to znovu.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historie</h1>
          <p className="mt-1 text-sm text-gray-600">
            Přehled všech vašich časových záznamů
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Souhrn */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Celkem hodin</p>
              <p className="text-2xl font-bold text-gray-900">{totalHours}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Calendar className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Počet záznamů</p>
              <p className="text-2xl font-bold text-gray-900">{filteredEntries.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Calendar className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Průměr hodin/den</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredEntries.length > 0 ? (totalHours / filteredEntries.length).toFixed(1) : '0'}h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabulka záznamů */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Časové záznamy - {format(new Date(selectedMonth + '-01'), 'LLLL yyyy')}
          </h3>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Žádné záznamy</h3>
            <p className="mt-1 text-sm text-gray-500">
              V tomto měsíci jste ještě nepřidali žádný záznam.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Datum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Čas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projekt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hodiny
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Popis
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akce
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEntries.map((entry) => {
                  const project = projects.find(p => p.id === entry.projectId);
                  
                  if (editingEntry === entry.id) {
                    return (
                      <tr key={entry.id} className="bg-blue-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="date"
                            value={editFormData.date}
                            onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                            className={`w-full px-2 py-1 text-sm border rounded ${
                              errors.date ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-1">
                            <input
                              type="time"
                              value={editFormData.startTime}
                              onChange={(e) => handleTimeChange('startTime', e.target.value)}
                              className={`w-20 px-1 py-1 text-xs border rounded ${
                                errors.startTime ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            <span className="text-xs py-1">-</span>
                            <input
                              type="time"
                              value={editFormData.endTime}
                              onChange={(e) => handleTimeChange('endTime', e.target.value)}
                              className={`w-20 px-1 py-1 text-xs border rounded ${
                                errors.endTime ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                          </div>
                          {(errors.startTime || errors.endTime) && (
                            <p className="text-xs text-red-600 mt-1">
                              {errors.startTime || errors.endTime}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={editFormData.projectId}
                            onChange={(e) => setEditFormData({ ...editFormData, projectId: e.target.value })}
                            className={`w-full px-2 py-1 text-sm border rounded ${
                              errors.projectId ? 'border-red-300' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Vyberte projekt</option>
                            {projects.filter(p => p.isActive).map(proj => (
                              <option key={proj.id} value={proj.id}>{proj.name}</option>
                            ))}
                          </select>
                          {errors.projectId && <p className="text-xs text-red-600 mt-1">{errors.projectId}</p>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {editFormData.hoursWorked}h
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editFormData.description}
                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            placeholder="Popis práce..."
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={handleSaveEdit}
                              className="text-green-600 hover:text-green-900 transition-colors duration-200"
                              title="Uložit změny"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                              title="Zrušit úpravy"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {format(new Date(entry.date), 'dd.MM.yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.startTime} - {entry.endTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project?.name || 'Neznámý projekt'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.hoursWorked}h
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {entry.description || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(entry)}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                            title="Upravit záznam"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                            title="Smazat záznam"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};