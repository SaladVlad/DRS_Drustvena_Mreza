# gunicorn_conf.py
def post_fork(server, worker):
    from run import start_server
    start_server()
