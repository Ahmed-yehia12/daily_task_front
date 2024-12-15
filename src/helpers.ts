import Swal from "sweetalert2"


export const AlertSuccess = (msg: string) => {
    return (
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: msg,
            showConfirmButton: false,
            timer: 1500
        })
    )
}

export const AlertError = (msg: string) => {
    return (
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: msg,
        })
    )
}

export const DeleteConfirmation = (msg: string) => {
    return (
        Swal.fire({
            icon: 'error',
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
            showDenyButton: true,
            text: msg,
        })
    )
}

export const AlertWarning = (msg: string) => {
    return (
        Swal.fire({
            icon: 'info',
            title: 'Oops...',
            text: msg,
        })
    )
}

export function AlertNav(msg: string, msgAway: string, navAway: any, msgStay: string, stay: any) {
    return (
        Swal.fire({
            title: 'Which Way?!!',
            text: msg,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: msgAway,
            cancelButtonText: msgStay,
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.assign(navAway)
            } else if (
                result.dismiss === Swal.DismissReason.cancel || result.dismiss === Swal.DismissReason.backdrop
            ) {
                window.location.assign(stay)
            }
        })
    )
}

export function AlertAsk(msg: any) {
    return (
        Swal.fire({
            title: 'Be Aware!!',
            text: msg,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            reverseButtons: true
        }).then((result) => {
            return result;
        })
    )
}