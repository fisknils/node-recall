# node-recall
A simple (forgetful) key/value memory storage for cli users.
```
Usage: recall [options] [command]

Options:
  -h, --help                   display help for command

Commands:
  kill                         Kills the background process
  status                       Checks whether the background process is running
  set [options] <key> [value]  Set the value of a key
  get <key>                    get a previously set key value
  clear <key>                  clear the store for a specific key
  prompt [options] <key>       If the key is not set, this command will prompt the user to enter the value
  help [command]               display help for command
```

## How it works
By forking a background process that keeps track of what you ask it to remember.  
It's only ever stored in the memory of that background process,  
so if you kill it, reboot, or let the timeout expire, all will be forgotten.

## Is it secure?
No.  
The only safety measure taken is that it's never stored anywhere aside from in the memory of the background process.
The client communicates with the background process through an unencrypted linux socket connection.  
Anyone and anything could connect the same way and ask for your dirtiest secrets.

## But.. why?
I'm not sure yet.  
