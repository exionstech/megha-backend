import { EventCategory, EventDay, EventStage } from "@prisma/client"
import { router } from "../__internals/router"
import { privateProcedure, publicProcedure } from "../procedures"
import { db } from "@/utils/db"
import { z } from "zod"
import { matchSorter } from "match-sorter"

export const eventRouter = router({
    createEvent: privateProcedure
        .input(
            z.object({
                title: z.string().min(3, {
                    message: "Title is Required",
                }),
                rules: z.array(z.string()).min(1, {
                    message: "Rules is Required",
                }),
                category: z.nativeEnum(EventCategory, {
                    required_error: "Category is Required",
                }),
                poster: z.string({
                    required_error: "Poster is Required",
                }),
                date: z.date({
                    required_error: "Date is Required",
                }),
                stage: z.nativeEnum(EventStage, {
                    required_error: "Stage is Required",
                }),
                groupSize: z.string({
                    required_error: "Group Size is Required",
                }),
                slotCount: z.string({
                    required_error: "Slot Count is Required",
                }),
                archived: z.boolean().optional(),
                price: z.string({
                    required_error: "Price is Required",
                }),
                pricePerPerson: z.boolean().optional(),
                coordinators: z.array(z.string()).min(1, {
                    message: "At least one coordinator is required",
                }),
                day: z.nativeEnum(EventDay, {
                    required_error: "Day is Required",
                }),
            })
        )
        .mutation(async ({ c, input }) => {
            try {
                const {
                    title,
                    rules,
                    category,
                    poster,
                    date,
                    stage,
                    groupSize,
                    slotCount,
                    archived,
                    price,
                    coordinators,
                    day,
                    pricePerPerson,
                } = input

                // Create the event in the database
                const event = await db.event.create({
                    data: {
                        title,
                        rules,
                        category,
                        poster,
                        date,
                        stage,
                        groupSize,
                        slotCount,
                        archived,
                        price,
                        day,
                        pricePerPerson,
                        coordinators: {
                            connect: coordinators.map((id) => ({
                                id,
                            })),
                        },
                    },
                })

                // Return a success response
                return c.json({
                    success: true,
                    event,
                    message: "Event created successfully",
                })
            } catch (error) {
                console.error("Error creating event:", error)
                
                // Return an error response
                return c.json({
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Failed to create the event",
                })
            }
        }),
    getEvents: privateProcedure
        .input(
            z.object({
                page: z.number().optional(),
                limit: z.number().optional(),
                search: z.string().optional(),
                stage: z.nativeEnum(EventStage).optional(),
                groupSize: z.string().optional(),
                category: z.string().optional(),
                day: z.string().optional(),
            })
        )
        .query(async ({ c, input }) => {
            const {
                page = 1,
                limit = 10,
                search,
                stage,
                groupSize,
                category,
                day,
            } = input
            let eventsArray = stage ? stage.split(".") : []
            let formatedEventsArray = groupSize ? groupSize.split(".") : []
            let categoryFormatedArray = category ? category.split(".") : []
            let dayFormatedArray = day ? day.split(".") : []

            let events = await db.event.findMany({
                include: {
                    coordinators: true,
                },
            })

            if (eventsArray.length > 0) {
                events = events.filter((event) => eventsArray.includes(event.stage))
            }
            if (formatedEventsArray.length > 0) {
                events = events.filter((event) =>
                    formatedEventsArray.includes(event.groupSize)
                )
            }

            if (categoryFormatedArray.length > 0) {
                events = events.filter((event) =>
                    categoryFormatedArray.includes(event.category)
                )
            }

            if (dayFormatedArray.length > 0) {
                events = events.filter((event) => dayFormatedArray.includes(event.day))
            }

            if (search) {
                events = matchSorter(events, search, {
                    keys: ["title", "stage", "category"],
                })
            }

            const allEvents = events.length

            const offset = (page - 1) * limit

            const paginatedEvents = events.slice(offset, offset + limit)

            return c.json({
                success: true,
                data: {
                    allEventCount: allEvents,
                    events: paginatedEvents,
                    offset,
                    limit,
                },
                message: "Events fetched successfully",
            })
        }),
    getEventById: privateProcedure
        .input(
            z.object({
                id: z.string({
                    required_error: "Event ID is Required",
                }),
            })
        )
        .query(async ({ c, input }) => {
            const { id } = input
            const event = await db.event.findUnique({
                where: { id },
                include: { coordinators: true },
            })
            return c.json({
                success: true,
                event,
                message: "Event fetched successfully",
            })
        }),
    updateEvent: privateProcedure
        .input(
            z.object({
                id: z.string({
                    required_error: "Event ID is Required",
                }),
                title: z.string().min(3, {
                    message: "Title is Required",
                }),
                rules: z.array(z.string()).min(1, {
                    message: "Rules is Required",
                }),
                category: z.nativeEnum(EventCategory, {
                    required_error: "Category is Required",
                }),
                poster: z.string({
                    required_error: "Poster is Required",
                }),
                date: z.date({
                    required_error: "Date is Required",
                }),
                stage: z.nativeEnum(EventStage, {
                    required_error: "Stage is Required",
                }),
                groupSize: z.string({
                    required_error: "Group Size is Required",
                }),
                slotCount: z.string({
                    required_error: "Slot Count is Required",
                }),
                archived: z.boolean().optional(),
                price: z.string({
                    required_error: "Price is Required",
                }),
                pricePerPerson: z.boolean().optional(),
                day: z.nativeEnum(EventDay, {
                    required_error: "Day is Required",
                }),
                coordinators: z.array(z.string()).min(1, {
                    message: "At least one coordinator is required",
                }),
            })
        )
        .mutation(async ({ c, input }) => {
            try {
                const {
                    id,
                    title,
                    rules,
                    category,
                    poster,
                    date,
                    stage,
                    groupSize,
                    slotCount,
                    archived,
                    price,
                    pricePerPerson,
                    coordinators,
                    day,
                } = input

                const currentEvent = await db.event.findUnique({
                    where: { id },
                    include: {
                        coordinators: true,
                    },
                })

                if (!currentEvent) {
                    return c.json({
                        success: false,
                        message: "Event Not Found",
                    })
                }
                // Update the event in the database
                const event = await db.event.update({
                    where: { id },
                    data: {
                        title,
                        rules,
                        category,
                        poster,
                        date,
                        stage,
                        groupSize,
                        slotCount,
                        archived,
                        price,
                        day,
                        pricePerPerson,
                        coordinators: {
                            disconnect: currentEvent.coordinators.map((e) => ({ id: e.id })),

                            connect: coordinators.map((id) => ({
                                id,
                            })),
                        },
                    },
                })

                // Return a success response
                return c.json({
                    success: true,
                    event,
                    message: "Event updated successfully",
                })
            } catch (error) {
                console.error("Error updating event:", error)

                // Return an error response
                return c.json({
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Failed to update the event",
                })
            }
        }),
    deleteEvent: privateProcedure
        .input(
            z.object({
                id: z.string({
                    required_error: "Event ID is Required",
                }),
            })
        )
        .mutation(async ({ c, input }) => {
            try {
                const { id } = input

                await db.event.delete({
                    where: { id },
                })

                return c.json({
                    success: true,
                    message: "Event deleted successfully",
                })
            } catch (error) {
                console.error("Error deleting event:", error)

                return c.json({
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Failed to delete the event",
                })
            }
        }),
    getEventsPublic: publicProcedure.query(async ({ c }) => {
        const events = await db.event.findMany({})
        return c.json({
            success: true,
            events,
            message: "Event fetched successfully",
        })
    }),
    getEventByIdPublic: publicProcedure
        .input(
            z.object({
                id: z.string({
                    required_error: "Event ID is Required",
                }),
            })
        )
        .query(async ({ c, input }) => {
            const { id } = input
            const event = await db.event.findUnique({
                where: { id },
                include: { coordinators: true },
            })
            return c.json({
                success: true,
                event,
                message: "Event fetched successfully",
            })
        }),
    getFilterEventsByPublic: publicProcedure
        .input(
            z.object({
                page: z.number().optional(),
                limit: z.number().optional(),
                search: z.string().optional(),
                stage: z.nativeEnum(EventStage).optional(),
                groupSize: z.string().optional(),
                category: z.string().optional(),
                day: z.string().optional(),
            })
        )
        .query(async ({ c, input }) => {
            const {
                page = 1,
                limit = 10,
                search,
                stage,
                groupSize,
                category,
                day,
            } = input
            let eventsArray = stage ? stage.split(".") : []
            let formatedEventsArray = groupSize ? groupSize.split(".") : []
            let categoryFormatedArray = category ? category.split(".") : []
            let dayFormatedArray = day ? day.split(".") : []

            let events = await db.event.findMany({
                include: {
                    coordinators: true,
                },
            })

            if (eventsArray.length > 0) {
                events = events.filter((event) => eventsArray.includes(event.stage))
            }
            if (formatedEventsArray.length > 0) {
                events = events.filter((event) =>
                    formatedEventsArray.includes(event.groupSize)
                )
            }

            if (categoryFormatedArray.length > 0) {
                events = events.filter((event) =>
                    categoryFormatedArray.includes(event.category)
                )
            }

            if (dayFormatedArray.length > 0) {
                events = events.filter((event) => dayFormatedArray.includes(event.day))
            }

            if (search) {
                events = matchSorter(events, search, {
                    keys: ["title", "stage"],
                })
            }

            const allEvents = events.length

            const offset = (page - 1) * limit

            const paginatedEvents = events.slice(offset, offset + limit)

            return c.json({
                success: true,
                data: {
                    allEventCount: allEvents,
                    events: paginatedEvents,
                    offset,
                    limit,
                },
                message: "Events fetched successfully",
            })
        }),
})