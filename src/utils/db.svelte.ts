import { writable, type Writable } from "svelte/store"
import { supabase } from "../supabaseClient"
import type { Task } from "./types"

const tableKey = "tasks"

export let db: Writable<Map<number, Task>> = writable(new Map<number, Task>)

export async function Insert(task: Task) {
  const {error} = await supabase.from(tableKey).insert(task)
}

export async function Delete(id: number) {
  const {error} = await supabase.from(tableKey).delete().eq("id", id)
}

export async function ToggleCompleted(task: Task) {
  task.completed = !task.completed
  const {error} = await supabase.from(tableKey).update(task).eq("id", task.id)
}

let chan = supabase.channel('custom-all-channel')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'tasks' },
    (payload) => {
      db.update((d) => {
        //@ts-ignore
        d.set(payload.new.id, payload.new)
        return d
      }) 
    }
  )
  .on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'tasks' },
    (payload) => {
      db.update((d) => {
        //@ts-ignore
        d.set(payload.new.id, payload.new)
        console.log(payload.new)
        return d
      }) 
    }
  )
  .on(
    'postgres_changes',
    { event: 'DELETE', schema: 'public', table: 'tasks' },
    (payload) => {
      db.update((d) => {
        //@ts-ignore
        d.delete(payload.old.id)
        console.log(payload)
        return d
      }) 
    }
  )
  .subscribe(async (state) => {
    if (state === "SUBSCRIBED") {
      const {data, error} = await supabase.from(tableKey).select("*")
      if (data === null) {
        return
      }
      db.update((d) => {
        data.forEach((row) => {
          d.set(row.id, row)
        })
        return d
      }) 
    }
})
