"use client";

import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface Teacher {
  teacherId: number;
  teacherName: string;
  subjectId: number;
  subjectName?: string;
  availabilitySummary?: string;
}

interface ProfessorTableProps {
  teachers: Teacher[];
  onEdit: (teacher: Teacher) => void;
  onDelete: (id: number) => void;
  onViewAvailability: (teacher: Teacher) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const ProfessorTable = ({ teachers, onEdit, onDelete, onViewAvailability, canEdit = true, canDelete = true }: ProfessorTableProps) => {
  const handleEdit = (teacher: Teacher) => {
    onEdit(teacher);
  };

  const handleDelete = (id: number) => {
    onDelete(id);
  };

  const handleViewAvailability = (teacher: Teacher) => {
    onViewAvailability(teacher);
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
                Materia
              </th>
              <th className="px-8 py-6 text-left text-base font-medium text-gray-700 uppercase tracking-wider">
                Disponibilidad
              </th>
              {(canEdit || canDelete) && (
                <th className="px-8 py-6 text-left text-base font-medium text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.map((teacher) => (
              <tr key={teacher.teacherId} className="hover:bg-gray-50 transition-colors">
                <td className="px-8 py-6 whitespace-nowrap text-base text-gray-900">
                  {teacher.teacherName}
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <span className="inline-block px-4 py-2 text-base font-medium text-indigo-600 bg-indigo-100 rounded-full">
                    {teacher.subjectName || 'Sin asignar'}
                  </span>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <button
                    onClick={() => handleViewAvailability(teacher)}
                    className={`inline-flex items-center px-4 py-2 text-base font-medium rounded-full transition-all duration-200 ${
                      teacher.availabilitySummary
                        ? 'text-green-600 bg-green-100 hover:bg-green-200 hover:shadow-sm'
                        : 'text-gray-600 bg-gray-100 hover:bg-gray-200 hover:shadow-sm'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {teacher.availabilitySummary ?
                      teacher.availabilitySummary.length > 15
                        ? `${teacher.availabilitySummary.substring(0, 15)}...`
                        : teacher.availabilitySummary
                      : 'Sin configurar'
                    }
                  </button>
                </td>
                {(canEdit || canDelete) && (
                  <td className="px-8 py-6 whitespace-nowrap text-base font-medium">
                    <div className="flex space-x-3">
                      {canEdit && (
                        <button
                          onClick={() => handleEdit(teacher)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </button>
                      )}
                      {canEdit && canDelete && <span className="text-gray-400 mx-2">|</span>}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(teacher.teacherId)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {teachers.length === 0 && (
        <div className="px-8 py-16 text-center">
          <p className="text-base text-gray-600">No hay profesores registrados</p>
        </div>
      )}
    </div>
  );
};

export default ProfessorTable;