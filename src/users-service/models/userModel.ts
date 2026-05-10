import fs from 'fs';
import path from 'path';

export interface User {
  usuarioId: number;
  correoElectronico: string;
  contrasena: string;
  nombreUsuario: string;
}

const dataPath = path.join(__dirname, '../../../data/users.json');

export const readUsers = async (): Promise<User[]> => {
  try {
    const data = await fs.promises.readFile(dataPath, 'utf-8');
    return JSON.parse(data).users;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // File doesn't exist, create it with empty users array
      await writeUsers([]);
      return [];
    }
    throw error;
  }
};

export const writeUsers = async (users: User[]): Promise<void> => {
  const dir = path.dirname(dataPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  await fs.promises.writeFile(dataPath, JSON.stringify({ users }, null, 2), 'utf-8');
};

export const findUserByEmail = async (correoElectronico: string): Promise<User | undefined> => {
  const users = await readUsers();
  return users.find(u => u.correoElectronico === correoElectronico);
};

export const findUserByUsername = async (nombreUsuario: string): Promise<User | undefined> => {
  const users = await readUsers();
  return users.find(u => u.nombreUsuario === nombreUsuario);
};

export const findUserById = async (usuarioId: number): Promise<User | undefined> => {
  const users = await readUsers();
  return users.find(u => u.usuarioId === usuarioId);
};

export const createUser = async (userData: Omit<User, 'usuarioId'>): Promise<User> => {
  const users = await readUsers();
  const maxId = users.reduce((max, u) => (u.usuarioId > max ? u.usuarioId : max), 0);
  const newUser = { ...userData, usuarioId: maxId + 1 };
  users.push(newUser);
  await writeUsers(users);
  return newUser;
};
