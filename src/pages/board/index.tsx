import { FormEvent, useState } from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'

import styles from './styles.module.scss'
import { FiCalendar, FiClock, FiEdit2, FiPlus, FiTrash, FiX } from 'react-icons/fi'
import { SupportButton } from '../../components/SupportButton'

import firebase from '../../services/firebaseConnection';
import format from 'date-fns/format'
import Link from 'next/link'

type TaskList = {
  id: string;
  created: string | Date;
  createdFormated?: string;
  tarefa: string;
  userId: string;
  nome: string;
}

interface BoardProps {
  user: {
    id: string;
    nome: string;
  }
  data: string;
}

export default function Board({ user, data }: BoardProps) {
  const [input, setInput] = useState('');
  const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data));
  const [taskEdit, setTaskEdit] = useState<TaskList | null>(null);

  async function handleAddTask(e: FormEvent) {
    e.preventDefault();

    if (input === '') {
      alert("Preencha alguma tarefa!")
      return;
    }

    if (taskEdit) {
      await firebase.firestore().collection('tarefas')
      .doc(taskEdit.id)
      .update({
        tarefa: input,
      })
      .then(() => {
        let data = taskList;
        let dataIndex = data.findIndex(item => item.id === taskEdit.id);
        data[dataIndex].tarefa = input;

        setTaskList(data);
        setTaskEdit(null);
        setInput('');
      })
      return;
    }

    await firebase.firestore().collection('tarefas').add({
      created: new Date(),
      tarefa: input,
      userId: user.id,
      nome: user.nome
    })
      .then((doc) => {
        console.log("Cadastrado")
        let data = {
          id: doc.id,
          created: new Date(),
          createdFormated: format(new Date(), "dd/MM/yyyy"),
          tarefa: input,
          userId: user.id,
          nome: user.nome
        }

        setTaskList([...taskList, data]);
        setInput('');
      }).catch((error) => {
        console.log("Erro", error)
      })
  }

  async function handleDelete(id: string) {
    await firebase.firestore().collection('tarefas').doc(id)
      .delete()
      .then(() => {
        setTaskList(taskList.filter(task => task.id !== id));
      }).catch((error) => {
        console.log("Erro", error)
      }
      )
  }

  async function handleEditTask(task: TaskList) {
    setTaskEdit(task);
    setInput(task.tarefa);
  }

  function handleCancelEdit() {
    setInput('');
    setTaskEdit(null);
  }


  return (
    <>
      <Head>
        <title>Minhas tarefas - Board</title>
      </Head>
      <main className={styles.container}>
        {taskEdit && (
          <span className={styles.warnText}>
            <button onClick={handleCancelEdit}>
              <FiX size={30} color="#ff3636" />
            </button>
            Voc?? est?? editando a tarefa: <b>{taskEdit.tarefa}</b>
          </span>
        )}
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Digite sua tarefa"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">
            <FiPlus size={25} color="#17181f" />
          </button>
        </form>

        <h1>Voc?? tem {taskList.length} {taskList.length === 1 ? 'tarefa' : 'tarefas'}!</h1>

        <section>
          {taskList.map(task => (
            <article key={task.id} className={styles.taskList}>
              <Link href={`/board/${task.id}`}>
                <p>{task.tarefa}</p>
              </Link>
              <div className={styles.actions}>
                <div>
                  <div>
                    <FiCalendar size={20} color="#ffb800" />
                    <time>{task.createdFormated}</time>
                  </div>
                  <button onClick={() => handleEditTask(task)}>
                    <FiEdit2 size={20} color="#fff" />
                    <span>Editar</span>
                  </button>
                </div>

                <button onClick={() => handleDelete(task.id)} >
                  <FiTrash size={20} color="#ff3636" />
                  <span>Excluir</span>
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      <div className={styles.vipContainer}>
        <h3>Obrigado por apoiar esse projeto</h3>

        <div>
          <FiClock size={28} color="#fff" />
          <time>Ultima doa????o foi a 3 dias</time>
        </div>
      </div>
      <SupportButton />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.id) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const tasks = await firebase.firestore().collection('tarefas')
    .where('userId', '==', session.id)
    .orderBy('created', 'asc').get();

  const data = JSON.stringify(tasks.docs.map(u => {
    return {
      id: u.id,
      createdFormated: format(u.data().created.toDate(), "dd/MM/yyyy"),
      ...u.data(),
    }
  }));

  const user = {
    nome: session?.user.name,
    id: session?.id
  }


  return {
    props: {
      user,
      data
    }
  }
}