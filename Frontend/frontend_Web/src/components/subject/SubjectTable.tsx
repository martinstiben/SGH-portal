"use client";

import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface Subject {
  subjectId: number;
  subjectName: string;
  profesoresAsociados?: number;
}

interface SubjectTableProps {
  subjects: Subject[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const SubjectTable = ({ subjects, onEdit, onDelete }: SubjectTableProps) => {
  const handleEdit = (id: number) => {
    onEdit(id);
  };

  const handleDelete = (id: number) => {
    onDelete(id);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-8 py-6 text-left text-base font-medium text-gray-700 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-8 py-6 text-left text-base font-medium text-gray-700 uppercase tracking-wider">
                N. Profesores asociados
              </th>
              <th className="px-8 py-6 text-left text-base font-medium text-gray-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjects.map((subject) => (
                <tr key={subject.subjectId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6 whitespace-nowrap text-base text-gray-900">
                    {subject.subjectName}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className="inline-block px-4 py-2 text-base font-medium text-indigo-600 bg-indigo-100 rounded-full">
                      {subject.profesoresAsociados || 0}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-base font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(subject.subjectId)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </button>
                      <span className="text-gray-400 mx-2">|</span>
                      <button
                        onClick={() => handleDelete(subject.subjectId)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      {subjects.length === 0 && (
        <div className="px-8 py-16 text-center">
          <p className="text-base text-gray-600">No hay materias registradas</p>
        </div>
      )}
    </div>
  );
};

export default SubjectTable;